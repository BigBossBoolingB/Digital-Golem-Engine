import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { exec } from 'child_process';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  const rendererUrl = process.env['ELECTRON_RENDERER_URL'];
  if (rendererUrl) {
    mainWindow.loadURL(rendererUrl);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  ipcMain.on('connect-rust', () => {
    console.log('IPC message [connect-rust] received. Executing Rust core...');
    const command = 'cargo run --manifest-path ../core/Cargo.toml -- --handshake';
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Rust Execution Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Rust Stderr: ${stderr}`);
      }
      if (stdout) {
        console.log(`Rust Stdout: ${stdout}`);
      }
    });
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
