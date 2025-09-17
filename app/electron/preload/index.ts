import { contextBridge, ipcRenderer } from 'electron';

const api = {
  send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('electron', { ipcRenderer: { send: api.send } });
  } catch (error) {
    console.error(error);
  }
} else {
  (window as any).api = api;
  (window as any).electron = { ipcRenderer: { send: api.send } };
}
