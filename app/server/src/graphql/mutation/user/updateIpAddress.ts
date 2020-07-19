import { GraphQLFieldConfig, GraphQLString } from "graphql";
import { isIPv4, isIPv6 } from "net";
import { ServerContext } from "../../../context";
import { pickUserProps } from "../../../discord/user/getUser";
import { userUpdatedSubscription } from "../../subscription/userUpdated";
import { UserType } from "../../types/User";

export const updateIpAddressMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { ipv4?: string; ipv6?: string }
> = {
  type: UserType,
  args: {
    ipv4: { type: GraphQLString },
    ipv6: { type: GraphQLString },
  },
  resolve: async (_, args, { db, user, pubsub }) => {
    if (args.ipv4 && !isIPv4(args.ipv4)) {
      throw new Error("ipv4 address is invalid");
    }
    if (args.ipv6 && !isIPv6(args.ipv6)) {
      throw new Error("ipv6 address is invalid");
    }
    if (!args.ipv4 && !args.ipv6) {
      throw new Error("One (or both) of ipv4 and ipv6 must be provided");
    }

    const updatedUser = await db.user.upsert({
      where: { id: user!.id },
      update: args,
      create: { ...pickUserProps(user!), ...args },
    });

    userUpdatedSubscription.publish(pubsub, updatedUser);

    return updatedUser;
  },
};
