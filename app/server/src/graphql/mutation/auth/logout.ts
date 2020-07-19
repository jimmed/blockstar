import { GraphQLBoolean, GraphQLFieldConfig } from "graphql";
import { ServerContext } from "../../../context";

export const logoutMutation: GraphQLFieldConfig<void, ServerContext> = {
  type: GraphQLBoolean,
  resolve: async (_, __, context): Promise<boolean> => {
    if (!context.user) {
      throw new Error("You must be logged in");
    }
    await context.discord.logout({ token: context.user.accessToken });
    delete context.user;
    return true;
  },
};
