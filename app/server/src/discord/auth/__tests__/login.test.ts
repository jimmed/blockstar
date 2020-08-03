import nock from "nock";
import { env } from "../../../lib/env";
import { discordApi } from "../../api";
import { discordLogin } from "../login";

jest.mock("../../../lib/env");
jest.mock("../../user/getUser");

nock.disableNetConnect();

describe("discordLogin", () => {
  const login = discordLogin(discordApi());

  describe("when the code is valid", () => {
    let scope: nock.Scope;

    beforeEach(async () => {
      scope = nock("https://discord.com/")
        .post("/api/v6/oauth2/token", {
          client_id: env.discordClientId,
          client_secret: env.discordClientSecret,
          grant_type: "authorization_code",
          code: "__LOGIN_CODE__",
          redirect_uri: "https://api/auth/redirect",
          scope: "identify",
        })
        .reply(200, {
          token_type: "Bearer",
          access_token: "__ACCESS_TOKEN__",
          expires_in: 600,
          refresh_token: "__REFRESH_TOKEN__",
          scope: "identify",
        });
    });

    afterEach(() => {
      scope.done();
    });

    it("resolves to a valid user", async () => {
      await expect(login({ code: "__LOGIN_CODE__" })).resolves.toEqual({
        tokenType: "Bearer",
        accessToken: "__ACCESS_TOKEN__",
        refreshToken: "__REFRESH_TOKEN__",
        scope: ["identify"],
        expiresAt: expect.any(Number),
        id: "@me",
        username: "__USERNAME__",
        discriminator: "__DISCRIMINATOR__",
        avatar: "__AVATAR__",
      });
    });
  });
});
