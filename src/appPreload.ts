import { initApi } from "./api"
import { initDb } from "./lib/db/api"
import { initUsb } from "./lib/usb/api"
import { initPcPrinter } from "./lib/pcprinter/api"

const os = require("os")
const path = require("path")
const { app } = require("electron").remote
const { contextBridge, ipcRenderer } = require("electron")

ipcRenderer.on("async-msg", (event, arg) => {
  console.log(arg)
})

function initApp(isDev) {
  const dbFilePath = isDev ? "socmag.db" : path.join(app.getPath("userData"), "socmag.db")
  const db  = initDb(dbFilePath)
  const usb = initUsb()
  const pcPrinter = initPcPrinter()
  const api = initApi(db, usb, pcPrinter)

  api.printPreview = {
    changeSettings : opts => ipcRenderer.send("pp-use-settings", opts),
    preview        : json => ipcRenderer.send("pp-print-preview", json),
  }

  contextBridge.exposeInMainWorld("api", api)
}

initApp(process.env.NODE_ENV !== "production")
