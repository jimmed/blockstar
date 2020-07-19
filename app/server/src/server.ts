import { ApolloServer, Config, PubSub } from "apollo-server";
import cors from "cors";
import express from "express";
import jwtMiddleware from "express-jwt";
import { execute, subscribe } from "graphql";
import { createServer as createHttpServer } from "http";
import { verify } from "jsonwebtoken";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeServerContext } from "./context";
import { DiscordLoginUserResult } from "./discord/auth/login";
import { makeSchema } from "./graphql";
import { env } from "./lib/env";

const ROOT_PATH = "/";

export const createServer = (
  serverOptions: Partial<Omit<Config, "schema" | "typeDefs" | "resolvers">> = {}
) => {
  const pubsub = new PubSub();
  const schema = makeSchema();
  const context = makeServerContext(pubsub);
  const graphql = new ApolloServer({ schema, context, ...serverOptions });

  const app = express().use(
    cors(),
    jwtMiddleware({
      algorithms: ["HS256"],
      secret: env.jwtSecret!,
      credentialsRequired: false,
    }),
    graphql.getMiddleware({ path: ROOT_PATH, cors: true })
  );

  const server = createHttpServer(app);

  const listen = (port: number, callback: (...args: any[]) => void) => {
    server.listen(port, (...args) => {
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
          onConnect: ({ authToken }) => {
            try {
              console.log(authToken);
              if (!authToken) {
                throw new Error("Authorization token must be provided");
              }

              const user = verify(authToken, env.jwtSecret!, {
                algorithms: ["HS256"],
              }) as DiscordLoginUserResult;

              return context({ req: { user } });
            } catch (error) {
              console.error("Authentication error", error.message);
              throw error;
            }
          },
        },
        { server, path: ROOT_PATH }
      );
      callback(...args);
    });
  };

  return new Proxy(server, {
    get: (s, key) => (key === "listen" ? listen : s[key]),
  });
};
