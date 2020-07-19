import gql from "graphql-tag";
import { FullLobbyFragment, FULL_LOBBY_FRAGMENT } from "../fragment/lobby";
import { Mutation } from "../lib/Mutation";
import { currentUserQuery } from "../query/currentUser";

export interface JoinLobbyResult {
  joinLobby: FullLobbyFragment;
}

export const JOIN_LOBBY_MUTATION = gql`
  mutation joinLobby($lobbyId: String!) {
    joinLobby(lobbyId: $lobbyId) {
      ...FullLobby
    }
  }
  ${FULL_LOBBY_FRAGMENT}
`;

export const joinLobbyMutation = Mutation.fromGql<JoinLobbyResult>(
  JOIN_LOBBY_MUTATION
)
  .extract("joinLobby")
  .withVariables((lobbyId: string) => ({ lobbyId }))
  .updates(currentUserQuery, (cached, joinedLobby) => {
    if (!cached?.currentUser || !joinedLobby) return;
    cached.currentUser.joinedLobbies = cached.currentUser.joinedLobbies
      .filter((x) => x.id !== joinedLobby.id)
      .concat([joinedLobby]);
  });
