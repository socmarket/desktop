import initApi from "./api";

const os = require("os");
const path = require("path");
const { app } = require("electron").remote;
const { contextBridge, ipcRenderer } = require("electron");

function initApp() {
  const dbPath = path.join(app.getPath("userData"), "socmag.db");
  const api = initApi(dbPath);
  contextBridge.exposeInMainWorld("api", api);
  contextBridge.exposeInMainWorld("db", api._db);
  contextBridge.exposeInMainWorld("usb", api._usb);

  ipcRenderer.on("async-msg", (msg, arg) => {
    console.log(msg, arg);
  });
}

initApp();
