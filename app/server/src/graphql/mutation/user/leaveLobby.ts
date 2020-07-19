import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";
import { ServerContext } from "../../../context";
import { LobbyType } from "../../types/Lobby";
import { userLeftLobbySubscription } from "../../subscription/userLeftLobby";

export const leaveLobbyMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { lobbyId: string }
> = {
  type: GraphQLBoolean,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { lobbyId }, { db, user, pubsub }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    const lobby = await db.lobby.findOne({
      where: { id: lobbyId },
      include: { users: true },
    });

    if (lobby && lobby.ownerId === user.id) {
      throw new Error("You cannot leave your own lobby, delete it instead");
    }

    if (!lobby || !lobby.users.find((u) => u.id === user.id)) {
      throw new Error("Lobby does not exist");
    }

    await db.lobby.update({
      where: { id: lobbyId },
      data: { users: { disconnect: [{ id: user.id }] } },
    });

    userLeftLobbySubscription.publish(pubsub, { userId: user.id, lobbyId });

    return true;
  },
};
