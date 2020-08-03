import { addSeconds, getUnixTime } from "date-fns";
import { URL } from "url";
import { Wretcher } from "wretch";
import { env } from "../../lib/env";
import { discordWithAuth } from "../api";
import { getDiscordUser, GetDiscordUserResult } from "../user/getUser";

export interface DiscordLoginParams {
  /** The code provided by query string on the redirect page of the frontend */
  code: string;
}

export interface DiscordLoginResult {
  tokenType: string;
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  scope: string[];
}

export interface DiscordLoginUserResult
  extends DiscordLoginResult,
    GetDiscordUserResult {}

export const discordLogin = (fetch: Wretcher) => async ({
  code,
}: DiscordLoginParams): Promise<DiscordLoginUserResult> => {
  const login = await fetch
    .url("/oauth2/token")
    .formUrl({
      client_id: env.discordClientId,
      client_secret: env.discordClientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: new URL("/auth/redirect", env.baseUrl).toString(),
      scope: "identify",
    })
    .post()
    .json<DiscordLoginResult>((result) => ({
      tokenType: result.token_type,
      accessToken: result.access_token,
      expiresAt: getUnixTime(addSeconds(new Date(), result.expires_in)),
      refreshToken: result.refresh_token,
      scope: result.scope.split(/\s+/g),
    }));

  const user = await getDiscordUser(
    discordWithAuth(login.accessToken, login.tokenType)
  )({ userId: "@me" });

  return { ...login, ...user };
};
