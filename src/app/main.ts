import path from "path";
import { format as formatUrl } from "url";
import { app, BrowserWindow } from "electron";

const isDevelopment = process.env.NODE_ENV !== "production"

function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:
      process.env.NODE_ENV === "development"
        ? { nodeIntegration: true }
          : { }
  })

  if (isDevelopment) {
    win.loadURL(`http://localhost:8080`)
  } else {
    win.loadFile("index.html");
  }
}

app.whenReady().then(createWindow)
