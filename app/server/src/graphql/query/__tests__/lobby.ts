import { PrismaClient, Lobby } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { ServerContext } from "../../../context";
import { lobbyQuery } from "../lobby";

jest.mock("@prisma/client");

const db = new PrismaClient();

describe("lobbyQuery", () => {
  describe("when the lobby exists", () => {
    beforeEach(() => {
      // @ts-ignore
      db.lobby.findOne.mockResolvedValue({
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "__LOBBY_ID__",
        name: "__LOBBY_NAME__",
        ownerId: "__LOBBY_OWNER_ID__",
        users: [{ id: "__LOBBY_OWNER_ID__" }, { id: "__LOBBY_MEMBER_ID__" }],
      });
    });

    describe.each([
      ["the lobby owner", { id: "__LOBBY_OWNER_ID__" }],
      ["a member of the lobby", { id: "__LOBBY_MEMBER_ID__" }],
    ])("when the user is %s", (_, user) => {
      it("resolves to with the lobby details", async () => {
        await expect(
          lobbyQuery().resolve!(
            void 0,
            { lobbyId: "__LOBBY_ID__" },
            { db, user } as ServerContext,
            {} as GraphQLResolveInfo
          )
        ).resolves.toEqual({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          id: "__LOBBY_ID__",
          name: "__LOBBY_NAME__",
          ownerId: "__LOBBY_OWNER_ID__",
          users: [{ id: "__LOBBY_OWNER_ID__" }, { id: "__LOBBY_MEMBER_ID__" }],
        } as Lobby);
      });
    });

    describe("when the user is neither a member of the lobby, nor the owner", () => {
      it("resolves to null", async () => {
        await expect(
          lobbyQuery().resolve!(
            void 0,
            { lobbyId: "__LOBBY_ID__" },
            { db, user: { id: "__OTHER_USER_ID__" } } as ServerContext,
            {} as GraphQLResolveInfo
          )
        ).resolves.toEqual(null);

        expect(db.lobby.findOne).toHaveBeenCalledWith({
          where: { id: "__LOBBY_ID__" },
          include: { users: true },
        });
      });
    });
  });

  describe("when the lobby does not exist", () => {
    beforeEach(() => {
      // @ts-ignore
      db.lobby.findOne.mockResolvedValue(undefined);
    });

    it("resolves to null", async () => {
      await expect(
        lobbyQuery().resolve!(
          void 0,
          { lobbyId: "__LOBBY_ID__" },
          { db, user: { id: "__OTHER_USER_ID__" } } as ServerContext,
          {} as GraphQLResolveInfo
        )
      ).resolves.toEqual(null);

      expect(db.lobby.findOne).toHaveBeenCalledWith({
        where: { id: "__LOBBY_ID__" },
        include: { users: true },
      });
    });
  });
});
