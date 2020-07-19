import gql from "graphql-tag";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import { FullLobbyFragment, FULL_LOBBY_FRAGMENT } from "../fragment/lobby";
import { Mutation } from "../lib/Mutation";
import { currentUserQuery } from "../query/currentUser";

export interface SaveLobbyResult {
  saveLobby: FullLobbyFragment;
}

export const SAVE_LOBBY_MUTATION = gql`
  mutation saveLobby($id: String, $name: String!) {
    saveLobby(id: $id, name: $name) {
      ...FullLobby
    }
  }
  ${FULL_LOBBY_FRAGMENT}
`;

export const saveLobbyMutation = Mutation.fromGql<SaveLobbyResult>(
  SAVE_LOBBY_MUTATION
)
  .extract("saveLobby")
  .withVariables((variables: { id?: string | null; name: string }) => variables)
  .updates(currentUserQuery, (cached, result) => {
    if (!result || !cached?.currentUser) return;
    cached.currentUser.ownedLobbies = cached.currentUser.ownedLobbies
      .filter((l) => l.id !== result.id)
      .concat([result]);
    cached.currentUser.joinedLobbies = cached.currentUser.joinedLobbies
      .filter((l) => l.id !== result.id)
      .concat([result]);
  });

export const useCreateLobby = () => {
  const saveLobby = saveLobbyMutation.use();
  return useCallback(
    (name: string) => {
      const id = uuid();
      return saveLobby({ id, name });
    },
    [saveLobby]
  );
};

export const useUpdateLobby = (id: string) => {
  const saveLobby = saveLobbyMutation.use();
  return useCallback((name: string) => saveLobby({ id, name }), [
    saveLobby,
    id,
  ]);
};
