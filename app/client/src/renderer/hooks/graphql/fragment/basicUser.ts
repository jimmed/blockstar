import gql from "graphql-tag";

export interface BasicUserFragment {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  ipv4: string | null;
  ipv6: string | null;
}

export const BASIC_USER_FRAGMENT = gql`
  fragment BasicUser on User {
    id
    username
    discriminator
    avatar
    ipv4
    ipv6
  }
`;
