import gql from "graphql-tag";
import { Mutation } from "../lib/Mutation";
import { currentUserQuery } from "../query/currentUser";

export interface LeaveLobbyResult {
  leaveLobby: boolean;
}

export const LEAVE_LOBBY_MUTATION = gql`
  mutation leaveLobby($lobbyId: String!) {
    leaveLobby(lobbyId: $lobbyId)
  }
`;

export const leaveLobbyMutation = Mutation.fromGql<LeaveLobbyResult>(
  LEAVE_LOBBY_MUTATION
)
  .extract("leaveLobby")
  .withVariables((lobbyId: string) => ({ lobbyId }))
  .updates(currentUserQuery, (cached, result, _, { lobbyId }) => {
    if (!cached?.currentUser || !result) return;
    cached.currentUser.joinedLobbies = cached.currentUser.joinedLobbies.filter(
      (x) => x.id !== lobbyId
    );
  });
