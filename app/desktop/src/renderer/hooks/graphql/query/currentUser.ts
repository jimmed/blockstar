import gql from "graphql-tag";
import { FullUserFragment, FULL_USER_FRAGMENT } from "../fragment/fullUser";
import { Query } from "../lib/Query";

export interface CurrentUserResult {
  currentUser: FullUserFragment;
}

export const currentUserQuery = Query.fromGql<CurrentUserResult>(
  gql`
    query currentUser {
      currentUser {
        ...FullUser
      }
    }
    ${FULL_USER_FRAGMENT}
  `
).extract("currentUser");
