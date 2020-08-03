import nock from "nock";
import { env } from "../../../lib/env";
import { discordApi } from "../../api";
import { discordLogout } from "../logout";

jest.mock("../../../lib/env");

const token = "__ACCESS_TOKEN__";

nock.disableNetConnect();

describe("discordLogout", () => {
  const logout = discordLogout(discordApi());

  describe("when the token is valid", () => {
    let scope: nock.Scope;

    beforeEach(async () => {
      scope = nock("https://discord.com/")
        .post("/api/v6/oauth2/token/revoke", {
          client_id: env.discordClientId,
          token,
        })
        .reply(200, {});
    });

    afterEach(() => {
      scope.done();
    });

    it("resolves", async () => {
      await expect(logout({ token })).resolves.toEqual({});
    });
  });
});
