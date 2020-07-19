import { User } from "@prisma/client";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { subscription } from "./subscription";

export const userUpdatedSubscription = subscription<
  User,
  "userUpdated",
  { userId: string }
>({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  dataKey: "userUpdated",
  topic: "USER_UPDATED",
  filter: (user, args) => user.id === args.userId,
});
