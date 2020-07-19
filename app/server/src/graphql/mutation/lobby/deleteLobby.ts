import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { v4 as isUuid } from "is-uuid";
import { ServerContext } from "../../../context";
import { lobbyDeletedSubscription } from "../../subscription/lobbyDeleted";

export const deleteLobbyMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { id: string | null }
> = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { id }, { db, user, pubsub }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    if (!id || !isUuid(id)) {
      throw new Error("A valid UUID must be provided");
    }

    const lobby = await db.lobby.findOne({ where: { id } });
    if (!lobby) {
      throw new Error("Lobby does not exist");
    }

    if (lobby.ownerId !== user.id) {
      throw new Error("You do not own this lobby");
    }

    await db.lobby.delete({ where: { id } });
    lobbyDeletedSubscription.publish(pubsub, id);

    return true;
  },
};
