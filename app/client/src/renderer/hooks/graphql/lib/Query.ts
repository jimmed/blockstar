import { QueryHookOptions, useQuery } from "@apollo/react-hooks";
import { DocumentNode } from "graphql";
import { useMemo } from "react";
import { cacheUpdater } from "./cacheUpdater";
import { Operation, OperationResult } from "./Operation";

export class Query<
  Result extends {},
  ResultKey extends keyof Result | null = null,
  Variables extends {} = {},
  Args extends any[] = []
> extends Operation<Result, ResultKey, Variables, Args> {
  static fromGql<QueryResult extends {}>(
    query: DocumentNode
  ): Query<QueryResult> {
    return new Query(query, null, {});
  }

  extract = Operation.prototype.extract as <NewDK extends keyof Result>(
    dataKey: NewDK
  ) => Query<Result, NewDK, Variables, Args>;

  withVariables = Operation.prototype.withVariables as <
    NewVariables extends {},
    NewArgs extends any[] = []
  >(
    variablesOrVariablesFn: NewVariables | ((...args: NewArgs) => NewVariables)
  ) => Query<Result, ResultKey, NewVariables, NewArgs>;

  public get query(): DocumentNode {
    return this.operation;
  }

  protected getQueryHookOptions(
    ...args: Args
  ): QueryHookOptions<Result, Variables> {
    return {
      variables: this.getVariables(...args),
    };
  }

  public use(...args: Args) {
    const { loading, data, error } = useQuery<Result, Variables>(
      this.query,
      useMemo(() => this.getQueryHookOptions(...args), args)
    );

    const extractedData = useMemo<OperationResult<Result, ResultKey>>(
      () =>
        (data && this.getExtractedResult(data)) as OperationResult<
          Result,
          ResultKey
        >,
      [data]
    );

    return useMemo(
      () =>
        ({ loading, error, ...extractedData } as {
          loading: boolean;
          error?: Error;
        } & Partial<typeof extractedData>),
      [loading, error, extractedData]
    );
  }

  public cacheUpdater(...args: Args) {
    return cacheUpdater<Result, Variables>(
      this.query,
      this.getVariables(...args)
    );
  }
}

export type QueryResult<Q extends Query<any, any, any, any>> = Q extends Query<
  infer R,
  any,
  any,
  any
>
  ? R
  : any;

export type QueryVariables<
  Q extends Query<any, any, any, any>
> = Q extends Query<any, any, infer R, any> ? R : any;
