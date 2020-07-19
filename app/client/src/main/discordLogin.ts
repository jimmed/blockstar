import { BrowserWindow, session } from "electron";
import { ipcListener } from "./ipc";

const API_ROOT = process.env.ELECTRON_WEBPACK_APP_API_ROOT;
const DISCORD_CLIENT_ID = process.env.ELECTRON_WEBPACK_APP_DISCORD_CLIENT_ID;

if (!API_ROOT) throw new Error("API_ROOT is not set");
if (!DISCORD_CLIENT_ID) throw new Error("DISCORD_CLIENT_ID is not set");

export const listenForLogin = () =>
  ipcListener<void, string | null>("discord-login", () => {
    const loginWindow = new BrowserWindow({
      autoHideMenuBar: true,
      titleBarStyle: "hidden",
    });

    const url = new URL("https://discord.com/oauth2/authorize");
    url.searchParams.set("client_id", DISCORD_CLIENT_ID);
    url.searchParams.set(
      "redirect_uri",
      new URL("/auth/redirect", API_ROOT).toString()
    );
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "identify");

    loginWindow.loadURL(url.toString());

    return new Promise((resolve) => {
      session.defaultSession.webRequest.onBeforeSendHeaders(
        {
          urls: [new URL("/*", API_ROOT).toString()],
        },
        (details, callback) => {
          callback({ cancel: true });
          const token = new URL(details.url).searchParams.get("code");
          resolve(token);
          if (!loginWindow.isDestroyed()) {
            loginWindow.close();
          }
        }
      );
      loginWindow.on("close", () => resolve(null));
    });
  });
