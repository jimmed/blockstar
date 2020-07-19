import { Wretcher } from "wretch";
import { env } from "../../lib/env";

export interface DiscordLogoutParams {
  token: string;
}

export const discordLogout = (fetch: Wretcher) => ({
  token,
}: DiscordLogoutParams) =>
  fetch
    .url("/oauth2/token/revoke")
    .formUrl({ client_id: env.discordClientId, token })
    .post()
    .json();
