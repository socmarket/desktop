// in preload scripts, we have access to node.js and electron APIs
// the remote web app will not have access, so this is safe

const os                = require('os');
const { app, contextBridge } = require('electron');

import initApi from "./api";

init();

function init() {
  const api = initApi("socmag.db");
  contextBridge.exposeInMainWorld("api", api);
  contextBridge.exposeInMainWorld("db", api._db);
  contextBridge.exposeInMainWorld("usb", api._usb);
}
