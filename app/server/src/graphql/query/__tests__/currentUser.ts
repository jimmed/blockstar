import { GraphQLResolveInfo } from "graphql";
import { ServerContext } from "../../../context";
import { discordApi } from "../../../discord/api";
import { currentUserQuery } from "../currentUser";

jest.mock("../../../discord/user/getUser");

describe("currentUserQuery", () => {
  it("resolves a user", async () => {
    await expect(
      currentUserQuery.resolve!(
        undefined,
        {},
        { discord: discordApi() } as ServerContext,
        {} as GraphQLResolveInfo
      )
    ).resolves.toEqual({
      avatar: "__AVATAR__",
      discriminator: "__DISCRIMINATOR__",
      id: "@me",
      username: "__USERNAME__",
    });
  });
});
