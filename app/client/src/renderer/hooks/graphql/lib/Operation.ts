import { DocumentNode } from "graphql";

export class Operation<
  Result extends {},
  ResultKey extends keyof Result | null = null,
  Variables extends {} = {},
  Args extends any[] = []
> {
  static fromGql<QueryResult extends {}>(
    operation: DocumentNode
  ): Operation<QueryResult> {
    return new (this.constructor as typeof Operation)(operation, null, {});
  }

  protected constructor(
    public readonly operation: DocumentNode,
    public readonly dataKey: ResultKey,
    public readonly variables: Variables | ((...args: Args) => Variables)
  ) {}

  public extract<NewDK extends keyof Result>(
    dataKey: NewDK
  ): Operation<Result, NewDK, Variables, Args> {
    return new (this.constructor as typeof Operation)(
      this.operation,
      dataKey,
      this.variables
    );
  }

  protected hasDataKey(): ResultKey extends keyof Result ? true : false {
    return !!this.dataKey as ResultKey extends keyof Result ? true : false;
  }

  protected getExtractedResult(
    result: Result
  ): OperationResult<Result, ResultKey> {
    return (this.hasDataKey()
      ? result?.[this.dataKey!]
      : result) as OperationResult<Result, ResultKey>;
  }

  public withVariables<NewVariables extends {}, NewArgs extends any[] = []>(
    variablesOrVariablesFn: NewVariables | ((...args: NewArgs) => NewVariables)
  ): Operation<Result, ResultKey, NewVariables, NewArgs> {
    return new (this.constructor as typeof Operation)(
      this.operation,
      this.dataKey,
      variablesOrVariablesFn
    );
  }

  protected getVariables(...args: Args | []): Variables {
    if (typeof this.variables === "function") {
      return (this.variables as (...args: Args) => Variables)(
        ...(args as Args)
      );
    }
    return this.variables;
  }
}

export type OperationResult<
  Result extends {},
  ResultKey extends keyof Result | null
> = ResultKey extends keyof Result ? Result[ResultKey] : Result;
