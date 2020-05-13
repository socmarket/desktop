import path from "path";
import { format as formatUrl } from "url";
import { app, BrowserWindow } from "electron";

const isDevelopment = process.env.NODE_ENV !== "production"

const createWindow = async () => {

  let webp = {
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    contextIsolation: true
  };

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: webp
  })

  win.webContents.openDevTools();
  /*
  if (isDevelopment) {
    win.webContents.openDevTools();
  }
  */

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  Promise.resolve({});
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
