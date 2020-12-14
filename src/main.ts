import os from "os"
import path from "path"
import proc from "process"
import { format as formatUrl } from "url"
import { app, BrowserWindow, autoUpdater, ipcMain, dialog, shell } from "electron"

let mainWindow = null
const isDev = process.env.NODE_ENV !== "production"

function createMainWindow() {

  const appWinOpts = {
    preload: APP_WIN_PRELOAD_WEBPACK_ENTRY,
    contextIsolation: true,
  }

  const printPreviewWinOpts = {
    preload: PRINT_PREVIEW_WIN_PRELOAD_WEBPACK_ENTRY,
    contextIsolation: true,
  }

  const appWin = new BrowserWindow({
    show: false,
    webPreferences: appWinOpts,
  })

  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    appWin.webContents.openDevTools()
  }

  appWin.loadURL(APP_WIN_WEBPACK_ENTRY)
  appWin.setMenuBarVisibility(false)

  const printPreviewWin = new BrowserWindow({
    show: false,
    webPreferences: printPreviewWinOpts,
  })

  printPreviewWin.loadURL(PRINT_PREVIEW_WIN_WEBPACK_ENTRY)
  printPreviewWin.setMenuBarVisibility(false)

  let printPreviewDestroyed = false

  printPreviewWin.webContents.on("destroyed", () => {
    printPreviewDestroyed = true
  })

  appWin.webContents.on("did-finish-load", () => {
    appWin.maximize()
  })

  ipcMain.on("pp-print-preview", (ev, msg) => {
    printPreviewWin.webContents.send("pp-print-preview", {
      wcId: printPreviewWin.webContents.id,
      msg: msg,
    })
  })

  ipcMain.on("pp-use-settings", (ev, opts) => {
    printPreviewWin.webContents.send("pp-use-settings", opts)
  })

  appWin.on("closed", () => {
    try {
      if (!printPreviewDestroyed) {
        printPreviewWin.close()
      }
    } catch (e) {
      console.log(e)
    }
  })

  return appWin
}

function sendMsg(win, msg) {
  win.webContents.send("async-msg", msg)
}

function setupUpdater(appWin) {
  const platform = process.arch === "x64" ? "win64" : "win32"

  if (process.platform === "darwin") {
    platform = "osx"
  }

  const url = `http://${UPDATES_HOST}/update/${platform}/${app.getVersion()}/beta/`
  autoUpdater.setFeedURL({ url })

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 300000)

  autoUpdater.on("checking-for-update", (event) => {
    sendMsg(appWin, { msg: "checking-for-update" })
  })

  autoUpdater.on("update-available", (event, arg) => {
    sendMsg(appWin, { msg: "update-available", arg: arg })
  })

  autoUpdater.on("update-not-available", (event, arg) => {
    sendMsg(appWin, { msg: "update-not-available", arg: arg })
  })

  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'Появились обновления для SocMarket. Перезапустите программу чтобы применить их.'
    }
    sendMsg(appWin, { msg: "update-downloaded", releaseNotes: releaseNotes, releaseName: releaseName })
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on("error", (event, msg) => {
    sendMsg(appWin, { msg: "update-error", msg: msg })
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
  if (!isDev) {
    setupUpdater(mainWindow)
  }
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
