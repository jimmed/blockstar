import { GraphQLObjectType } from "graphql";
import { ServerContext } from "../../context";
import { lobbyDeletedSubscription } from "./lobbyDeleted";
import { lobbyUpdatedSubscription } from "./lobbyUpdated";
import { userJoinedLobbySubscription } from "./userJoinedLobby";
import { userLeftLobbySubscription } from "./userLeftLobby";
import { userUpdatedSubscription } from "./userUpdated";

export const subscription = new GraphQLObjectType<void, ServerContext>({
  name: "Subscription",
  fields: () => ({
    lobbyDeleted: lobbyDeletedSubscription.graphqlType,
    lobbyUpdated: lobbyUpdatedSubscription.graphqlType,
    userJoinedLobby: userJoinedLobbySubscription.graphqlType,
    userLeftLobby: userLeftLobbySubscription.graphqlType,
    userUpdated: userUpdatedSubscription.graphqlType,
  }),
});
