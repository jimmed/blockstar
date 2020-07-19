import { GraphQLObjectType } from "graphql";
import { ServerContext } from "../../context";
import { userQuery } from "./user";
import { currentUserQuery } from "./currentUser";
import { lobbyQuery } from "./lobby";

export const query = new GraphQLObjectType<void, ServerContext>({
  name: "Query",
  fields: () => ({
    currentUser: currentUserQuery,
    user: userQuery(),
    lobby: lobbyQuery(),
  }),
});
