import { UserDelegate, LobbyDelegate } from "@prisma/client";

const { PrismaClient: RealPrismaClient } = jest.requireActual("@prisma/client");

type ValidDelegates = UserDelegate | LobbyDelegate;

const mockPromiseFn = (name: string) =>
  jest
    .fn()
    .mockRejectedValue(
      new Error(`A mock return value for ${name} must be implemented`)
    );

const mockEntity = <T extends ValidDelegates>(): T =>
  (({
    findOne: mockPromiseFn("findOne"),
    create: mockPromiseFn("create"),
    delete: mockPromiseFn("delete"),
    update: mockPromiseFn("update"),
    deleteMany: mockPromiseFn("deleteMany"),
    findMany: mockPromiseFn("findMany"),
    updateMany: mockPromiseFn("updateMany"),
    upsert: mockPromiseFn("upsert"),
    count: mockPromiseFn("count"),
  } as any) as T);

export class PrismaClient extends RealPrismaClient {
  user = mockEntity<UserDelegate>();
  lobby = mockEntity<LobbyDelegate>();
}
