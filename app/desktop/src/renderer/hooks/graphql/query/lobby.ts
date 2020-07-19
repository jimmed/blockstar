import gql from "graphql-tag";
import { FullLobbyFragment, FULL_LOBBY_FRAGMENT } from "../fragment/lobby";
import { Query } from "../lib/Query";

export interface LobbyResult {
  lobby: FullLobbyFragment;
}

export const LOBBY_QUERY = gql`
  query lobby($lobbyId: String!) {
    lobby(lobbyId: $lobbyId) {
      ...FullLobby
    }
  }
  ${FULL_LOBBY_FRAGMENT}
`;

export const lobbyQuery = Query.fromGql<LobbyResult>(LOBBY_QUERY)
  .extract("lobby")
  .withVariables((lobbyId: string) => ({ lobbyId }));
