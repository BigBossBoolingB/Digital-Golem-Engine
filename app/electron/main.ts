import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let pythonProcess: ChildProcessWithoutNullStreams | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('before-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill()
    pythonProcess = null
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

ipcMain.on('get-config', (event) => {
  const configPath = path.join(process.env.VITE_PUBLIC, 'config.json');
  fs.readFile(configPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Failed to read config file:', err);
      event.sender.send('get-config-reply', { error: err.message });
      return;
    }
    event.sender.send('get-config-reply', JSON.parse(data));
  });
});

ipcMain.on('save-config', (event, data) => {
    const configPath = path.join(process.env.VITE_PUBLIC, 'config.json');
    fs.writeFile(configPath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Failed to write config file:', err);
            event.sender.send('save-config-reply', { error: err.message });
            return;
        }
        event.sender.send('save-config-reply', { success: true });
    });
});

ipcMain.on('run-python', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }

    const mainPyPath = path.join(process.env.VITE_PUBLIC, 'main.py');
    // The python script will default to config.json in the same directory.
    pythonProcess = spawn('python3', [mainPyPath]);

    pythonProcess.stdout.on('data', (data) => {
        // The python script now sends self-contained JSON objects, separated by newlines.
        const messages = data.toString().split('\n').filter(msg => msg.trim() !== '');
        messages.forEach(msg => {
            win?.webContents.send('python-stdout', msg);
        });
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString();
        console.error(`Python stderr: ${errorMessage}`);
        win?.webContents.send('python-stderr', errorMessage);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python process exited with code ${code}`);
        }
        pythonProcess = null;
    });
});

ipcMain.on('python-stdin', (_event, data) => {
  if (pythonProcess) {
    // The python script now expects a JSON string per line.
    pythonProcess.stdin.write(JSON.stringify(data) + '\n');
  }
});