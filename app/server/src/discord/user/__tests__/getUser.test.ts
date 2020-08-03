import nock from "nock";
import { discordApi } from "../../api";
import { getDiscordUser } from "../getUser";

jest.mock("../../../lib/env");

const userId = "__USER_ID__";

nock.disableNetConnect();

describe("discordLogin", () => {
  const getUser = getDiscordUser(discordApi());

  describe("when the code is valid", () => {
    let scope: nock.Scope;

    beforeEach(async () => {
      scope = nock("https://discord.com/")
        .get(`/api/v6/users/${userId}`)
        .reply(200, {
          id: "__USER_ID__",
          username: "__USERNAME__",
          discriminator: "__DISCRIMINATOR__",
          avatar: "__AVATAR__",
        });
    });

    afterEach(() => {
      scope.done();
    });

    it("resolves to a valid user", async () => {
      await expect(getUser({ userId })).resolves.toEqual({
        id: "__USER_ID__",
        username: "__USERNAME__",
        discriminator: "__DISCRIMINATOR__",
        avatar: "__AVATAR__",
      });
    });
  });
});
