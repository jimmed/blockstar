import { GetDiscordUserParams, GetDiscordUserResult } from "../getUser";

export const getDiscordUser = () => ({
  userId,
}: GetDiscordUserParams): Promise<GetDiscordUserResult> =>
  Promise.resolve({
    id: userId,
    username: "__USERNAME__",
    discriminator: "__DISCRIMINATOR__",
    avatar: "__AVATAR__",
  });
