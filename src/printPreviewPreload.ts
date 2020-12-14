import { initPcPrinter } from "./lib/pcprinter/api"
const { contextBridge, ipcRenderer } = require("electron")

function init(isDev) {

  const api = {
    onPrintPreview: (f) => {
      ipcRenderer.on("pp-print-preview", (ev, packet) => {
        f(packet)
      })
    },
    onUseSettings: (f) => {
      ipcRenderer.on("pp-use-settings", (ev, opts) => {
        f(opts)
      })
    },
    pcPrinter: initPcPrinter(),
  }

  contextBridge.exposeInMainWorld("api", api)
}

init(process.env.NODE_ENV !== "production")
