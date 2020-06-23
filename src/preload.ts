import { initApi } from "./api"
import { initDb } from "./lib/db/api"
import { initUsb } from "./lib/usb/api"

const os = require("os")
const path = require("path")
const { app } = require("electron").remote
const { contextBridge } = require("electron")

function initApp(isDev) {
  const dbFilePath = isDev ? "socmag.db" : path.join(app.getPath("userData"), "socmag.db")
  const db  = initDb(dbFilePath)
  const usb = initUsb()
  const api = initApi(db, usb)
  contextBridge.exposeInMainWorld("api", api)
}

initApp(process.env.NODE_ENV !== "production")
