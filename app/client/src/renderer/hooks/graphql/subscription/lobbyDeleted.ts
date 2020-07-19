import gql from "graphql-tag";
import { Subscription } from "../lib/Subscription";
import { currentUserQuery } from "../query/currentUser";

export interface LobbyDeletedResult {
  lobbyDeleted: string;
}

export const LOBBY_DELETED_SUBSCRIPTION = gql`
  subscription lobbyDeleted($lobbyId: String!) {
    lobbyDeleted(lobbyId: $lobbyId)
  }
`;

export const lobbyDeletedSubscription = Subscription.fromGql<
  LobbyDeletedResult
>(LOBBY_DELETED_SUBSCRIPTION)
  .extract("lobbyDeleted")
  .withVariables((lobbyId: string) => ({ lobbyId }))
  .updates(currentUserQuery, (cached, lobbyDeleted) => {
    if (!cached || !lobbyDeleted) return;

    cached.currentUser.joinedLobbies = cached.currentUser.joinedLobbies.filter(
      (lobby) => lobby.id !== lobbyDeleted
    );
    cached.currentUser.ownedLobbies = cached.currentUser.ownedLobbies.filter(
      (lobby) => lobby.id !== lobbyDeleted
    );
  });
