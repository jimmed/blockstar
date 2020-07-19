import gql from "graphql-tag";
import { FullLobbyFragment, FULL_LOBBY_FRAGMENT } from "../fragment/lobby";
import { Subscription } from "../lib/Subscription";
import { currentUserQuery } from "../query/currentUser";

export interface LobbyUpdatedResult {
  lobbyUpdated: FullLobbyFragment;
}

export const LOBBY_UPDATED_SUBSCRIPTION = gql`
  subscription lobbyUpdated($lobbyId: String!) {
    lobbyUpdated(lobbyId: $lobbyId) {
      ...FullLobby
    }
  }
  ${FULL_LOBBY_FRAGMENT}
`;

export const lobbyUpdatedSubscription = Subscription.fromGql<
  LobbyUpdatedResult
>(LOBBY_UPDATED_SUBSCRIPTION)
  .extract("lobbyUpdated")
  .withVariables((lobbyId: string) => ({ lobbyId }))
  .updates(currentUserQuery, (cached, lobby, _, { lobbyId }) => {
    if (!cached) return;
    Object.assign(
      cached.currentUser.ownedLobbies.find((lobby) => lobby.id === lobbyId),
      lobby
    );
    Object.assign(
      cached.currentUser.joinedLobbies.find((lobby) => lobby.id === lobbyId),
      lobby
    );
  });
