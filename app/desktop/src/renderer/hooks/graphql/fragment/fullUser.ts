import gql from "graphql-tag";
import { BasicUserFragment, BASIC_USER_FRAGMENT } from "./basicUser";
import { FullLobbyFragment, FULL_LOBBY_FRAGMENT } from "./lobby";

export interface FullUserFragment extends BasicUserFragment {
  ownedLobbies: FullLobbyFragment[];
  joinedLobbies: FullLobbyFragment[];
}

export const FULL_USER_FRAGMENT = gql`
  fragment FullUser on User {
    ...BasicUser
    ownedLobbies {
      ...FullLobby
    }
    joinedLobbies {
      ...FullLobby
    }
  }
  ${BASIC_USER_FRAGMENT}
  ${FULL_LOBBY_FRAGMENT}
`;
