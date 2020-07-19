import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ServerContext } from "../../context";
import { UserType } from "../types/User";

export const userQuery = (): GraphQLFieldConfig<
  void | null,
  ServerContext,
  { userId: string }
> => ({
  type: new GraphQLNonNull(UserType),
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { userId }, { db, user }) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    return db.user.findOne({ where: { id: userId } });
  },
});
