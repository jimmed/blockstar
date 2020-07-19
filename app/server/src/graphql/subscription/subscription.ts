import { PubSub, withFilter } from "apollo-server";
import { GraphQLArgumentConfig, GraphQLFieldConfig } from "graphql";
import { ServerContext } from "../../context";

export const subscription = <
  Payload,
  DataKey extends string,
  Args extends {} = {},
  Resolved = Payload
>({
  topic,
  filter,
  dataKey,
  ...graphqlType
}: Omit<
  GraphQLFieldConfig<void, ServerContext, Args>,
  "subscribe" | "resolve"
> & {
  args: Record<keyof Args, GraphQLArgumentConfig>;
  topic: string;
  dataKey: DataKey;
  filter: (
    payload: Payload,
    args: Args,
    context: ServerContext
  ) => boolean | Promise<boolean>;
  resolve?: (
    payload: Payload,
    args: Args,
    context: ServerContext
  ) => Resolved | Promise<Resolved>;
}) => ({
  graphqlType: ({
    ...graphqlType,
    subscribe: (_: any, args: Args, context: ServerContext) =>
      withFilter(
        () => context.pubsub.asyncIterator(topic),
        (payload: Record<DataKey, Payload>) =>
          filter(payload[dataKey], args, context)
      )(_, args, context),
  } as any) as GraphQLFieldConfig<void, ServerContext, Args>,
  publish: (pubsub: PubSub, payload: Payload) =>
    pubsub.publish(topic, { [dataKey]: payload }),
});
