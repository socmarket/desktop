import os from "os"
import path from "path"
import proc from "process"
import { format as formatUrl } from "url"
import { app, BrowserWindow, autoUpdater, ipcMain, dialog } from "electron"

let mainWindow = null
const isDev = process.env.NODE_ENV !== "production"

function createMainWindow() {
  let webp = {
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    contextIsolation: true
  }

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: webp
  })

  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    win.webContents.openDevTools()
  }

  win.maximize()
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  win.setMenuBarVisibility(false)
  win.show()

  return win
}

function sendMsg(win, msg) {
  win.webContents.send("async-msg", msg)
}

function setupUpdater(win) {
  const server = "http://127.0.0.1"

  let platform = process.arch === "x64" ? "win64" : "win32"

  if (process.platform === "darwin") {
    platform = "osx"
  }

  const url = `${server}/update/${platform}/${app.getVersion()}/beta/`

  autoUpdater.setFeedURL({ url })

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 300000)

  autoUpdater.on("checking-for-update", (event) => {
    sendMsg(win, { msg: "checking-for-update" })
  })

  autoUpdater.on("update-available", (event, arg) => {
    sendMsg(win, { msg: "update-available", arg: arg })
  })

  autoUpdater.on("update-not-available", (event, arg) => {
    sendMsg(win, { msg: "update-not-available", arg: arg })
  })

  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'Появились обновления для SocMarket. Перезапустите программу чтобы применить их.'
    }
    sendMsg(win, { msg: "update-downloaded", releaseNotes: releaseNotes, releaseName: releaseName })
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on("error", (event, msg) => {
    sendMsg(win, { msg: "update-error", msg: msg })
  })
}

if (!isDev) {
  if (proc.platform === "win32" || proc.platform === "darwin") {
    if (require("electron-squirrel-startup")) {
      app.quit()
    }
  }
}

app.on("ready", () => {
  mainWindow = createMainWindow()
  setupUpdater(mainWindow)
})

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null)
    mainWindow = createMainWindow()
})

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit()
  }
})
