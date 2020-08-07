import { GraphQLFieldConfig } from "graphql";
import { ServerContext } from "../../context";
import { UserType } from "../types/User";

export const currentUserQuery: GraphQLFieldConfig<void, ServerContext, {}> = {
  type: UserType,
  resolve: async (_, __, { discord, user }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }
    return discord.getUser({ userId: "@me" });
  },
};
