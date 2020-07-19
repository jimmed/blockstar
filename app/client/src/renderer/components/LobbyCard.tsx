import React, { FC } from "react";
import {
  FlexProps,
  Flex,
  Skeleton,
  Heading,
  Stack,
  Button,
} from "@chakra-ui/core";
import { useLobby } from "../hooks/useLobby";
import { CopyToClipboard } from "./CopyToClipboard";
import { PromptButton } from "./PromptButton";
import { useActiveLobby } from "../hooks/useActiveLobby";

export const LobbyCard: FC<
  FlexProps & { lobbyId: string; userIsOwner: boolean }
> = ({ lobbyId, userIsOwner, ...props }) => {
  const lobby = useLobby(lobbyId);
  const { isActive, activate, deactivate } = useActiveLobby(lobbyId);
  return (
    <Flex bg="gray.700" mt={4} p={4} minW="md" maxW="md" {...props}>
      <Flex
        w="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton isLoaded={!lobby.loading}>
          <Heading color="gray.300" size="md">
            {lobby.name}
          </Heading>
        </Skeleton>
        <Stack direction="row">
          <CopyToClipboard
            size="sm"
            variantColor="blue"
            value={lobby.id}
            isDisabled={lobby.loading}
          >
            Invite
          </CopyToClipboard>
          {userIsOwner ? (
            <PromptButton
              size="sm"
              variantColor="red"
              onAccept={lobby.delete}
              actionLabel="Delete"
              promptLabel="Are you sure you want to delete this lobby? This action cannot be reversed"
              headerLabel={`Delete Lobby "${lobby.name}"`}
              isDisabled={lobby.loading}
            >
              Delete
            </PromptButton>
          ) : (
            <PromptButton
              size="sm"
              variantColor="red"
              onAccept={lobby.leave}
              actionLabel="Leave"
              promptLabel="Are you sure you want to leave this lobby? You can rejoin any time with the same lobby code."
              headerLabel={`Leave Lobby "${lobby.name}"`}
              isDisabled={lobby.loading}
            >
              Leave
            </PromptButton>
          )}
          <Button
            size="sm"
            variantColor={isActive ? "green" : "red"}
            onClick={isActive ? deactivate : activate}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
