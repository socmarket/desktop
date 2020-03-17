import path from "path";
import { format as formatUrl } from "url";
import { app, BrowserWindow } from "electron";

const isDevelopment = process.env.NODE_ENV !== "production"

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: isDevelopment ? { nodeIntegration: true } : { }
  })

  if (isDevelopment) {
    win.loadURL(`http://localhost:8080`)
  } else {
    win.loadFile("index.html");
  }

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
