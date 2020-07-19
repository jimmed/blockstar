import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ServerContext } from "../../../context";
import { lobbyUpdatedSubscription } from "../../subscription/lobbyUpdated";
import { LobbyType } from "../../types/Lobby";

export const changeLobbyOwnerMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { lobbyId: string; ownerId: string }
> = {
  type: LobbyType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { lobbyId, ownerId }, { db, user, pubsub }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    const lobby = await db.lobby.findOne({
      where: { id: lobbyId },
      include: { users: true },
    });

    if (
      !lobby ||
      (lobby.ownerId !== user.id && !lobby.users.find((u) => u.id === user.id))
    ) {
      throw new Error("Lobby does not exist");
    }

    if (lobby.ownerId !== user.id) {
      throw new Error("You must be the owner of this lobby");
    }

    if (!lobby.users.find((u) => u.id === ownerId)) {
      throw new Error("New owner must be a member of the lobby");
    }

    const lobbyUpdated = await db.lobby.update({
      where: { id: lobbyId },
      data: { owner: { connect: { id: ownerId } } },
    });

    lobbyUpdatedSubscription.publish(pubsub, lobbyUpdated);

    return lobbyUpdated;
  },
};
