import { app } from "electron";
import { listenForLogin } from "./discordLogin";
import { listenForGraphQL } from "./graphql";
import { listenForIpAddress } from "./ipAddress";
import { createWindow } from "./window";

const uri = new URL(process.env.ELECTRON_WEBPACK_APP_API_ROOT!).toString();

app.on("ready", () => {
  listenForLogin();
  listenForGraphQL(uri);
  listenForIpAddress();
  createWindow();
});
app.allowRendererProcessReuse = true;

// @ts-ignore
if (module.hot) module.hot.accept();
