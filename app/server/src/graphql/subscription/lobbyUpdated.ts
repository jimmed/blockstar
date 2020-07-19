import { Lobby } from "@prisma/client";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { LobbyType } from "../types/Lobby";
import { subscription } from "./subscription";

export const lobbyUpdatedSubscription = subscription<
  Lobby,
  "lobbyUpdated",
  { lobbyId: string }
>({
  type: LobbyType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  dataKey: "lobbyUpdated",
  topic: "LOBBY_UPDATED",
  filter: (lobby, args) => lobby.id === args.lobbyId,
});
