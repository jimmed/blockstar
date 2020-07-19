import { GraphQLFieldConfig } from "graphql";
import { ServerContext } from "../../context";
import { UserType } from "../types/User";

export const currentUserQuery: GraphQLFieldConfig<void, ServerContext, {}> = {
  type: UserType,
  resolve: async (_, __, { discord }) => discord.getUser({ userId: "@me" }),
};
