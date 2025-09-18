import { app as n, BrowserWindow as a, ipcMain as R } from "electron";
import { fileURLToPath as _ } from "node:url";
import e from "node:path";
import { exec as f } from "node:child_process";
const s = e.dirname(_(import.meta.url));
process.env.APP_ROOT = e.join(s, "..");
const t = process.env.VITE_DEV_SERVER_URL, g = e.join(process.env.APP_ROOT, "dist-electron"), l = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = t ? e.join(process.env.APP_ROOT, "public") : l;
let o;
function d() {
  o = new a({
    width: 1280,
    height: 800,
    icon: e.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: e.join(s, "preload.mjs")
    }
  }), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), t ? o.loadURL(t) : o.loadFile(e.join(l, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  a.getAllWindows().length === 0 && d();
});
n.whenReady().then(d);
R.on("connect-rust", () => {
  const r = e.join(s, "..", "core"), p = `cargo run --manifest-path ${e.join(r, "Cargo.toml")} -- --handshake`;
  console.log("IPC message received. Attempting to connect to Rust core..."), f(p, { cwd: r }, (i, m, c) => {
    if (i) {
      console.error(`exec error: ${i}`);
      return;
    }
    console.log(`Rust stdout: ${m}`), c && console.error(`Rust stderr: ${c}`);
  });
});
export {
  g as MAIN_DIST,
  l as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};
