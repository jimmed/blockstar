import { UserGetPayload } from "@prisma/client";
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { ServerContext } from "../../context";
import { LobbyType } from "./Lobby";

export interface RootUser extends UserGetPayload<{}> {}

export const UserType = new GraphQLObjectType<RootUser, ServerContext>({
  name: "User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    username: { type: GraphQLNonNull(GraphQLString) },
    discriminator: { type: GraphQLNonNull(GraphQLString) },
    avatar: { type: GraphQLNonNull(GraphQLString) },
    ipv4: { type: GraphQLString },
    ipv6: { type: GraphQLString },
    joinedLobbies: {
      type: new GraphQLList(LobbyType),
      resolve: (user, _, { db }) =>
        db.lobby.findMany({ where: { users: { some: { id: user.id } } } }),
    },
    ownedLobbies: {
      type: new GraphQLList(LobbyType),
      resolve: (user, _, { db }) =>
        db.lobby.findMany({ where: { ownerId: { equals: user.id } } }),
    },
  }),
});
