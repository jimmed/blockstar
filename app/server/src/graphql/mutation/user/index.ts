import { joinLobbyMutation } from "./joinLobby";
import { kickFromLobbyMutation } from "./kickFromLobby";
import { leaveLobbyMutation } from "./leaveLobby";
import { updateIpAddressMutation } from "./updateIpAddress";

export const userMutations = {
  joinLobby: joinLobbyMutation,
  kickFromLobby: kickFromLobbyMutation,
  leaveLobby: leaveLobbyMutation,
  updateIpAddress: updateIpAddressMutation,
};
