import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { v4 as isUuid } from "is-uuid";
import { ServerContext } from "../../../context";
import { pickUserProps } from "../../../discord/user/getUser";
import { lobbyUpdatedSubscription } from "../../subscription/lobbyUpdated";
import { LobbyType } from "../../types/Lobby";

export const saveLobbyMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { id: string; name: string }
> = {
  type: LobbyType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { name, id }, { db, user, pubsub }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    if (!name.trim()) {
      throw new Error("A name must be provided");
    }

    if (id && !isUuid(id)) {
      throw new Error("A valid UUID must be provided");
    }

    const ownerId = { id: user.id };
    const userProps = pickUserProps(user);

    await db.user.upsert({
      where: ownerId,
      create: userProps,
      update: userProps,
    });

    const existingLobby = id && (await db.lobby.findOne({ where: { id } }));
    if (!existingLobby) {
      return await db.lobby.create({
        data: {
          id,
          name,
          owner: { connect: ownerId },
          users: { connect: [ownerId] },
        },
      });
    }

    if (existingLobby.ownerId !== user.id) {
      throw new Error("You do not have permission to edit this lobby");
    }

    const updatedLobby = await db.lobby.update({
      data: { name },
      where: { id },
    });

    lobbyUpdatedSubscription.publish(pubsub, updatedLobby);

    return updatedLobby;
  },
};
