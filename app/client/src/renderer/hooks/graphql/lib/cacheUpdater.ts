import { OnSubscriptionDataOptions } from "@apollo/react-common";
import { MutationUpdaterFn } from "apollo-client";
import { DocumentNode } from "graphql";
import { Draft, produce } from "immer";
import { OperationResult } from "./Operation";

export interface CacheTransformer<
  CacheType,
  Result,
  Variables,
  ResultKey extends keyof Result | null
> {
  (
    cached: Draft<CacheType> | null,
    result: OperationResult<Result, ResultKey>,
    cacheVariables: Variables
  ): Draft<CacheType> | null | void;
}

export interface MutationCacheTransformer<
  CacheType,
  Result,
  CacheVars,
  MutVars,
  ResultKey extends keyof Result | null
> {
  (
    cached: Draft<CacheType> | null,
    result: OperationResult<Result, ResultKey>,
    cacheVariables: CacheVars,
    mutationVariables: MutVars
  ): Draft<CacheType> | null | void;
}

export const cacheUpdater = <CacheType, CacheVariables = {}>(
  cacheQuery: DocumentNode,
  cacheVariables?: CacheVariables
) => ({
  transform: <Result, ResultKey extends keyof Result | null>(
    transformer: CacheTransformer<CacheType, Result, CacheVariables, ResultKey>,
    dataKey: ResultKey
  ) => ({
    forMutation: (): MutationUpdaterFn<Result> => (proxy, mutationResult) =>
      updateCache<CacheType, Result, CacheVariables, ResultKey>(
        proxy,
        cacheQuery,
        transformer,
        mutationResult.data,
        cacheVariables,
        dataKey
      ),
    forSubscription: () => ({
      subscriptionData,
      client,
    }: OnSubscriptionDataOptions<Result>) =>
      updateCache<CacheType, Result, CacheVariables, ResultKey>(
        client.cache,
        cacheQuery,
        transformer,
        subscriptionData.data,
        cacheVariables,
        dataKey
      ),
  }),
});

const updateCache = <
  CacheType,
  Result,
  CacheVariables,
  ResultKey extends keyof Result | null
>(
  cache: {
    readQuery(options: {
      query: DocumentNode;
      variables: CacheVariables;
    }): CacheType | null;
    writeQuery(options: {
      query: DocumentNode;
      variables: CacheVariables;
      data: CacheType;
    }): void;
  },
  query: DocumentNode,
  transformer: CacheTransformer<CacheType, Result, CacheVariables, ResultKey>,
  result: Result | null | undefined,
  variables: CacheVariables = {} as CacheVariables,
  resultKey: ResultKey = null as ResultKey
) => {
  if (!result) return;

  const cached = cache.readQuery({ query, variables });

  const updated = produce(cached, (cached) =>
    transformer(
      cached,
      (resultKey ? result[resultKey!] : result) as OperationResult<
        Result,
        ResultKey
      >,
      variables
    )
  ) as CacheType;

  if (!updated) return;

  cache.writeQuery({ query, variables, data: updated });
};
