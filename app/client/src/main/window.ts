import { BrowserWindow } from "electron";

let mainWindow: Electron.BrowserWindow | null;

export const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(`http://localhost:9080`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html")}`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
