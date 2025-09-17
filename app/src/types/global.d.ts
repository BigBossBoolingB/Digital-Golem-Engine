export {}

declare global {
  interface Window {
    dge?: {
      handshake: () => Promise<{ ok: boolean; output: string }>
    }
    electron?: {
      ipcRenderer: {
        send: (channel: string, data?: unknown) => void
      }
    }
    api?: {
      send: (channel: string, data?: unknown) => void
      on: (channel: string, listener: (data: any) => void) => void
    }
  }
}
