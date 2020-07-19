import gql from "graphql-tag";
import { FullUserFragment, FULL_USER_FRAGMENT } from "../fragment/fullUser";
import { Mutation } from "../lib/Mutation";
import { currentUserQuery } from "../query/currentUser";

export interface LoginResult {
  login: {
    token: string;
    user: FullUserFragment;
  };
}

export const LOGIN_MUTATION = gql`
  mutation login($code: String!) {
    login(code: $code) {
      token
      user {
        ...FullUser
      }
    }
  }
  ${FULL_USER_FRAGMENT}
`;

export const loginMutation = Mutation.fromGql<LoginResult>(LOGIN_MUTATION)
  .extract("login")
  .withVariables((code: string) => ({ code }))
  .updates(currentUserQuery, (_, { user }) => ({ currentUser: user }));
