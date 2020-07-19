import { useMemo } from "react";
import { FullLobbyFragment } from "./graphql/fragment/lobby";
import { joinLobbyMutation } from "./graphql/mutation/joinLobby";
import { useCreateLobby } from "./graphql/mutation/saveLobby";
import { currentUserQuery } from "./graphql/query/currentUser";

interface LobbiesHook {
  all?: (FullLobbyFragment & { userIsOwner: boolean })[];
  owned?: FullLobbyFragment[];
  joined?: FullLobbyFragment[];
  createNew(name: string): void;
  joinExisting(id: string): void;
}

export const useLobbies = (): LobbiesHook => {
  const user = currentUserQuery.use();

  const all = useMemo(
    () =>
      user.joinedLobbies
        ?.map((lobby) => ({
          ...lobby,
          userIsOwner: !!user.ownedLobbies?.some(
            (owned) => owned.id === lobby.id
          ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [user.joinedLobbies, user.ownedLobbies]
  );

  const createNew = useCreateLobby();
  const joinExisting = joinLobbyMutation.use() as (
    lobbyId: string
  ) => Promise<any>;

  return useMemo(
    () => ({
      all,
      owned: user.ownedLobbies,
      joined: user.joinedLobbies,
      createNew,
      joinExisting,
    }),
    [all, user.ownedLobbies, user.joinedLobbies, createNew, joinExisting]
  );
};
