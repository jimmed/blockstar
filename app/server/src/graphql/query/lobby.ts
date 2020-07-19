import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ServerContext } from "../../context";
import { LobbyType } from "../types/Lobby";

export const lobbyQuery = (): GraphQLFieldConfig<
  void,
  ServerContext,
  { lobbyId: string }
> => ({
  type: LobbyType,
  args: {
    lobbyId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { lobbyId }, { db, user }) => {
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
      return null;
    }

    return lobby;
  },
});
