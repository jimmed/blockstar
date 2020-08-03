import { PrismaClient } from "@prisma/client";
import { PubSub } from "apollo-server";
import { fromUnixTime } from "date-fns";
import { discordApi, DiscordApi, discordWithAuth } from "./discord/api";
import { DiscordLoginUserResult } from "./discord/auth/login";
import { GetDiscordUserResult } from "./discord/user/getUser";

export interface ServerContext {
  user?: ServerUser;
  discord: DiscordApi;
  db: PrismaClient;
  pubsub: PubSub;
}

export interface ServerUser extends GetDiscordUserResult {
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
}

export interface GraphQLRequestContext {
  req: { user?: DiscordLoginUserResult };
}

const db = new PrismaClient();

export const makeServerContext = (pubsub: PubSub) => ({
  req,
}: GraphQLRequestContext): ServerContext => ({
  user: userContextFromJwtPayload(req.user)!,
  discord: discordApiForUser(req.user),
  db,
  pubsub,
});

export const discordApiForUser = (user?: DiscordLoginUserResult) =>
  user ? discordWithAuth(user.accessToken, user.tokenType) : discordApi();

export const userContextFromJwtPayload = (
  user?: DiscordLoginUserResult
): ServerUser | undefined =>
  user && {
    ...user,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    tokenExpiresAt: fromUnixTime(user.expiresAt),
  };
