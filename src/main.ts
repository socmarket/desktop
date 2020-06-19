import path from "path";
import { format as formatUrl } from "url";
import { app, BrowserWindow } from "electron";

let mainWindow = null
const isDevelopment = process.env.NODE_ENV !== "production"

const createWindow = async () => {

  let webp = {
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    contextIsolation: true
  };

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: webp
  })

  if (isDevelopment) {
    win.webContents.openDevTools();
  }

  win.maximize();
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  win.show();

  return win;
}

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  mainWindow = createWindow();
});

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null)
    mainWindow = createWindow();
});
