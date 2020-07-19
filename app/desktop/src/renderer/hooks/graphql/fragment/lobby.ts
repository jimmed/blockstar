import gql from "graphql-tag";
import { BasicUserFragment, BASIC_USER_FRAGMENT } from "./basicUser";

export interface FullLobbyFragment {
  id: string;
  name: string;
  owner: { id: string };
  users: BasicUserFragment[];
}

export const FULL_LOBBY_FRAGMENT = gql`
  fragment FullLobby on Lobby {
    id
    name
    owner {
      id
    }
    users {
      ...BasicUser
    }
  }
  ${BASIC_USER_FRAGMENT}
`;
