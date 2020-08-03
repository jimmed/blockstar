import FormData from "form-data";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import wretch, { Wretcher } from "wretch";
import { discordLogin } from "./auth/login";
import { discordLogout } from "./auth/logout";
import { getDiscordUser } from "./user/getUser";

export interface DiscordApi extends Wretcher {
  login: ReturnType<typeof discordLogin>;
  logout: ReturnType<typeof discordLogout>;
  getUser: ReturnType<typeof getDiscordUser>;
}

const wrapApiRoot = (root: Wretcher): Wretcher & DiscordApi =>
  Object.assign(root, {
    login: discordLogin(root),
    logout: discordLogout(root),
    getUser: getDiscordUser(root),
  });

export const discordApi = () =>
  wrapApiRoot(
    wretch()
      .polyfills({ fetch, FormData, URLSearchParams })
      .url("https://discord.com/api/v6")
  );

export const discordWithAuth = (
  authToken: string,
  tokenType: string = "Bearer"
) => wrapApiRoot(discordApi().auth(`${tokenType} ${authToken}`));
