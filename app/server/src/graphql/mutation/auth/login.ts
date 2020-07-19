import { differenceInSeconds } from "date-fns";
import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { sign as signJwt } from "jsonwebtoken";
import { omit } from "lodash";
import { ServerContext, userContextFromJwtPayload } from "../../../context";
import { pickUserProps } from "../../../discord/user/getUser";
import { env } from "../../../lib/env";
import { userUpdatedSubscription } from "../../subscription/userUpdated";
import { UserType } from "../../types/User";

export const LoginResult = new GraphQLObjectType<
  { token: string },
  ServerContext
>({
  name: "LoginResult",
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: UserType },
  },
});

export const loginMutation: GraphQLFieldConfig<
  void,
  ServerContext,
  { code: string }
> = {
  type: LoginResult,
  args: {
    code: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (_, { code }, context): Promise<{ token: string }> => {
    if (context.user) {
      throw new Error("Logged in already");
    }

    const discordUser = await context.discord.login({ code });
    context.user = userContextFromJwtPayload(discordUser)!;

    const token = await new Promise<string>((resolve, reject) =>
      signJwt(
        discordUser,
        env.jwtSecret!,
        {
          expiresIn: differenceInSeconds(
            context.user!.tokenExpiresAt,
            Date.now()
          ),
        },
        (err, token) => (err ? reject(err) : resolve(token))
      )
    );

    const userPayload = pickUserProps(context.user);
    const updatedUser = await context.db.user.upsert({
      where: { id: context.user.id },
      create: userPayload,
      update: omit(userPayload, "id"),
    });

    userUpdatedSubscription.publish(context.pubsub, updatedUser);

    return { token };
  },
};
