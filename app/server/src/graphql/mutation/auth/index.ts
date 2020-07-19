import { loginMutation } from "./login";
import { logoutMutation } from "./logout";

export const authMutations = {
  login: loginMutation,
  logout: logoutMutation,
};
