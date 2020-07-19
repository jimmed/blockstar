import { OnSubscriptionDataOptions } from "@apollo/react-common";
import { SubscriptionHookOptions, useSubscription } from "@apollo/react-hooks";
import { DocumentNode } from "graphql";
import { useMemo } from "react";
import { MutationCacheTransformer } from "./cacheUpdater";
import { Operation } from "./Operation";
import { Query, QueryResult, QueryVariables } from "./Query";

export class Subscription<
  Result extends {},
  ResultKey extends keyof Result | null = null,
  Variables extends {} = {},
  Args extends any[] = []
> extends Operation<Result, ResultKey, Variables, Args> {
  private updateFns: ((
    variables: Variables,
    ...args: Args
  ) => (update: OnSubscriptionDataOptions<Result>) => void)[] = [];

  static fromGql<SubscriptionResult extends {}>(
    subscription: DocumentNode
  ): Subscription<SubscriptionResult> {
    return new Subscription(subscription, null, {});
  }

  extract = Operation.prototype.extract as <NewDK extends keyof Result>(
    dataKey: NewDK
  ) => Subscription<Result, NewDK, Variables, Args>;

  withVariables = Operation.prototype.withVariables as <
    NewVariables extends {},
    NewArgs extends any[] = []
  >(
    variablesOrVariablesFn: NewVariables | ((...args: NewArgs) => NewVariables)
  ) => Subscription<Result, ResultKey, NewVariables, NewArgs>;

  public get subscription(): DocumentNode {
    return this.operation;
  }

  public updates<Q extends Query<any, any, any, any>>(
    query: Q,
    transform: MutationCacheTransformer<
      QueryResult<Q>,
      Result,
      QueryVariables<Q>,
      Variables,
      ResultKey
    >
  ) {
    this.updateFns.push((mutVars, ...args) =>
      query
        .cacheUpdater(...args)
        .transform<Result, ResultKey>(
          (cached, result, cacheVars) =>
            transform(cached, result, cacheVars, mutVars),
          this.dataKey
        )
        .forSubscription()
    );
    return this;
  }

  protected getSubscriptionHookOptions(
    ...args: Args | []
  ): SubscriptionHookOptions<Result, Variables> {
    const variables = this.getVariables(...args);
    return {
      variables,
      onSubscriptionData: (options) => {
        this.updateFns.forEach((update) =>
          update(variables, ...(args as Args))(options)
        );
      },
    };
  }

  public use(...args: Args | []) {
    useSubscription<Result, Variables>(
      this.subscription,
      useMemo(() => this.getSubscriptionHookOptions(...args), args)
    );
  }
}

export type SubscriptionResult<
  M extends Subscription<any, any, any, any>
> = M extends Subscription<infer R, any, any, any> ? R : any;

export type SubscriptionVariables<
  M extends Subscription<any, any, any, any>
> = M extends Subscription<any, infer R, any, any> ? R : any;
