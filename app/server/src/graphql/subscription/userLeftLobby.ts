import { User } from "@prisma/client";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../types/User";
import { subscription } from "./subscription";

export const userLeftLobbySubscription = subscription<
  { userId: string; lobbyId: string },
  "userLeftLobby",
  { lobbyId: string },
  User | null
>({
  type: UserType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  dataKey: "userLeftLobby",
  topic: "USER_LEFT_LOBBY",
  filter: (event, args) => event.lobbyId === args.lobbyId,
  resolve: (event, _, { db }) =>
    db.user.findOne({ where: { id: event.userId } }),
});
