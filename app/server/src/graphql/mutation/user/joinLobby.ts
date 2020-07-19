import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ServerContext } from "../../../context";
import { LobbyType } from "../../types/Lobby";
import { userJoinedLobbySubscription } from "../../subscription/userJoinedLobby";

export const joinLobbyMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { lobbyId: string }
> = {
  type: LobbyType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { lobbyId }, { db, user, pubsub }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    const lobby = await db.lobby.findOne({ where: { id: lobbyId } });
    if (!lobby) {
      throw new Error("Lobby does not exist");
    }

    const updatedLobby = db.lobby.update({
      where: { id: lobbyId },
      data: { users: { connect: [{ id: user.id }] } },
    });

    userJoinedLobbySubscription.publish(pubsub, { userId: user.id, lobbyId });

    return updatedLobby;
  },
};
