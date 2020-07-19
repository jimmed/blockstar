import gql from "graphql-tag";
import { Mutation } from "../lib/Mutation";
import { currentUserQuery } from "../query/currentUser";

export interface DeleteLobbyResult {
  deleteLobby: boolean;
}

export const DELETE_LOBBY_MUTATION = gql`
  mutation deleteLobby($lobbyId: String!) {
    deleteLobby(id: $lobbyId)
  }
`;

export const deleteLobbyMutation = Mutation.fromGql<DeleteLobbyResult>(
  DELETE_LOBBY_MUTATION
)
  .extract("deleteLobby")
  .withVariables((lobbyId: string) => ({ lobbyId }))
  .updates(currentUserQuery, (cached, deleted, _, { lobbyId }) => {
    if (!cached || !deleted) return;
    cached.currentUser.joinedLobbies = cached.currentUser.joinedLobbies.filter(
      (lobby) => lobby.id !== lobbyId
    );
    cached.currentUser.ownedLobbies = cached.currentUser.ownedLobbies.filter(
      (lobby) => lobby.id !== lobbyId
    );
  });
