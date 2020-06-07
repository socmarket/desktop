import initApi from "./api";

const os                     = require("os");
const { app, contextBridge } = require("electron");

!function () {
  const api = initApi("socmag.db");
  contextBridge.exposeInMainWorld("api", api);
  contextBridge.exposeInMainWorld("db", api._db);
  contextBridge.exposeInMainWorld("usb", api._usb);
}();
