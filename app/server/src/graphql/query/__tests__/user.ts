import { PrismaClient } from "@prisma/client";
import { userQuery } from "../user";
import { ServerContext } from "../../../context";
import { GraphQLResolveInfo } from "graphql";

jest.mock("@prisma/client");

const db = new PrismaClient();

describe("userQuery", () => {
  describe("when the user exists", () => {
    const user = {
      id: "__USER_ID__",
      username: "__USERNAME__",
      discriminator: "__DISCRIMINATOR__",
      avatar: "__AVATAR__",
      ipv4: "__IPV4__",
      ipv6: "__IPV6__",
    };

    beforeEach(() => {
      // @ts-ignore
      db.user.findOne.mockResolvedValue(user);
    });

    it("resolves the user details", async () => {
      await expect(
        userQuery().resolve!(
          undefined,
          { userId: "__USER_ID__" },
          {
            db,
            user: {},
          } as ServerContext,
          {} as GraphQLResolveInfo
        )
      ).resolves.toEqual(user);

      expect(db.user.findOne).toHaveBeenCalledWith({
        where: { id: "__USER_ID__" },
      });
    });
  });
});
