import { changeLobbyOwnerMutation } from "./changeLobbyOwner";
import { deleteLobbyMutation } from "./deleteLobby";
import { saveLobbyMutation } from "./saveLobby";

export const lobbyMutations = {
  changeLobbyOwner: changeLobbyOwnerMutation,
  deleteLobby: deleteLobbyMutation,
  saveLobby: saveLobbyMutation,
};
