import { lobbyQuery } from "./graphql/query/lobby";
import { lobbyDeletedSubscription } from "./graphql/subscription/lobbyDeleted";
import { lobbyUpdatedSubscription } from "./graphql/subscription/lobbyUpdated";
import { deleteLobbyMutation } from "./graphql/mutation/deleteLobby";
import { leaveLobbyMutation } from "./graphql/mutation/leaveLobby";
import { useMemo } from "react";

export const useLobby = (lobbyId: string) => {
  const lobby = lobbyQuery.use(lobbyId);
  lobbyDeletedSubscription.use(lobbyId);
  lobbyUpdatedSubscription.use(lobbyId);
  const delete_ = deleteLobbyMutation.use(lobbyId);
  const leave = leaveLobbyMutation.use(lobbyId);
  return useMemo(() => ({ ...lobby, delete: delete_, leave }), [
    lobby,
    delete_,
    leave,
  ]);
};
