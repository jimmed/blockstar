export const discordLogin = () => () => ({
  token_type: "Bearer",
  access_token: "__ACCESS_TOKEN__",
  expires_in: 600,
  refresh_token: "__REFRESH_TOKEN__",
  scope: "identify",
  id: "__USER_ID__",
  username: "__USERNAME__",
  discriminator: "__DISCRIMINATOR__",
  avatar: "__AVATAR__",
});
