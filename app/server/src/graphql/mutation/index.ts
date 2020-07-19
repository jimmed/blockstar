import { GraphQLObjectType } from "graphql";
import { authMutations } from "./auth";
import { userMutations } from "./user";
import { lobbyMutations } from "./lobby";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...authMutations,
    ...userMutations,
    ...lobbyMutations,
  }),
});
