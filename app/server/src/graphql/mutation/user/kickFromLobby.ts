import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { ServerContext } from "../../../context";
import { userLeftLobbySubscription } from "../../subscription/userLeftLobby";

export const kickFromLobbyMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { lobbyId: string; userId: string }
> = {
  type: GraphQLBoolean,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { lobbyId, userId }, { db, user, pubsub }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    const lobby = await db.lobby.findOne({
      where: { id: lobbyId },
      include: { users: true },
    });

    if (
      !lobby ||
      !(lobby.ownerId === user.id || lobby.users.find((u) => u.id === user.id))
    ) {
      throw new Error("Lobby does not exist");
    }

    if (lobby.ownerId !== user.id) {
      throw new Error("Only owners may kick users from a lobby");
    }

    if (userId === user.id) {
      throw new Error("You may not kick yourself from your own lobby.");
    }

    await db.lobby.update({
      where: { id: lobbyId },
      data: { users: { disconnect: [{ id: userId }] } },
    });

    userLeftLobbySubscription.publish(pubsub, { userId, lobbyId });

    return true;
  },
};
