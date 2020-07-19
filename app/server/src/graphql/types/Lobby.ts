import { LobbyGetPayload } from "@prisma/client";
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { ServerContext } from "../../context";
import { userQuery } from "../query/user";
import { UserType } from "./User";

export interface RootLobby extends LobbyGetPayload<{}> {}

export const LobbyType = new GraphQLObjectType<RootLobby, ServerContext>({
  name: "Lobby",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLString) },
    owner: {
      type: UserType,
      resolve: ({ ownerId }, _, ...rest) =>
        userQuery().resolve!(null, { userId: ownerId }, ...rest),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (lobby, _, { db }) =>
        db.user.findMany({
          where: { joinedLobbies: { some: { id: { equals: lobby.id } } } },
        }),
    },
  }),
});
