import { MutationHookOptions, useMutation } from "@apollo/react-hooks";
import { MutationUpdaterFn } from "apollo-client";
import { DocumentNode } from "graphql";
import { useCallback, useMemo } from "react";
import { MutationCacheTransformer } from "./cacheUpdater";
import { Operation } from "./Operation";
import { Query, QueryResult, QueryVariables } from "./Query";

export class Mutation<
  Result extends {},
  ResultKey extends keyof Result | null = null,
  Variables extends {} = {},
  Args extends any[] = []
> extends Operation<Result, ResultKey, Variables, Args> {
  private updateFns: ((
    variables: Variables,
    ...args: Args
  ) => MutationUpdaterFn<Result>)[] = [];

  static fromGql<MutationResult extends {}>(
    query: DocumentNode
  ): Mutation<MutationResult> {
    return new Mutation(query, null, {});
  }

  extract = Operation.prototype.extract as <NewDK extends keyof Result>(
    dataKey: NewDK
  ) => Mutation<Result, NewDK, Variables, Args>;

  withVariables = Operation.prototype.withVariables as <
    NewVariables extends {},
    NewArgs extends any[] = []
  >(
    variablesOrVariablesFn: NewVariables | ((...args: NewArgs) => NewVariables)
  ) => Mutation<Result, ResultKey, NewVariables, NewArgs>;

  public get mutation(): DocumentNode {
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
        .forMutation()
    );
    return this;
  }

  protected getMutationHookOptions(
    ...args: Args | []
  ): MutationHookOptions<Result, Variables> {
    const variables = this.getVariables(...args);
    return {
      variables,
      update: (proxy, result) =>
        this.updateFns.forEach((update) =>
          update(variables, ...(args as Args))(proxy, result)
        ),
    };
  }

  public use(...args: Args | []) {
    const [mutate] = useMutation<Result, Variables>(
      this.mutation,
      useMemo(() => this.getMutationHookOptions(...args), args)
    );

    return useCallback(
      async (...callbackArgs: Args | []) => {
        try {
          const variables = callbackArgs.length
            ? this.getVariables(...(callbackArgs as Args))
            : this.getVariables(...args);
          return await mutate({ variables });
        } catch (error) {
          console.error(`Error in mutation`, JSON.parse(JSON.stringify(error)));
          throw error;
        }
      },
      [mutate]
    );
  }
}

export type MutationResult<
  M extends Mutation<any, any, any, any>
> = M extends Mutation<infer R, any, any, any> ? R : any;

export type MutationVariables<
  M extends Mutation<any, any, any, any>
> = M extends Mutation<any, infer R, any, any> ? R : any;
