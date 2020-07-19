import { Wretcher } from "wretch";
import { pick } from "lodash/fp";

export interface GetDiscordUserParams {
  userId: string;
}

export interface GetDiscordUserResult {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export const pickUserProps = pick<
  GetDiscordUserResult,
  keyof GetDiscordUserResult
>(["id", "username", "discriminator", "avatar"]);

export const getDiscordUser = (fetch: Wretcher) => ({
  userId,
}: GetDiscordUserParams): Promise<GetDiscordUserResult> =>
  fetch.url(`/users/${userId}`).get().json(pickUserProps);
