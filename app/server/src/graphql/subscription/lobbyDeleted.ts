import { GraphQLNonNull, GraphQLString } from "graphql";
import { subscription } from "./subscription";

export const lobbyDeletedSubscription = subscription<
  string,
  "lobbyDeleted",
  { lobbyId: string }
>({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  dataKey: "lobbyDeleted",
  topic: "LOBBY_DELETED",
  filter: (lobbyId, args) => lobbyId === args.lobbyId,
});
