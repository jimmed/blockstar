import {
  Button,
  Flex,
  FlexProps,
  Heading,
  Icon,
  Skeleton,
  Stack,
  Tooltip,
} from "@chakra-ui/core";
import React, { FC } from "react";
import { useActiveLobby } from "../hooks/useActiveLobby";
import { useLobby } from "../hooks/useLobby";
import { CopyToClipboard } from "./CopyToClipboard";
import { PromptButton } from "./PromptButton";

export const LobbyCard: FC<
  FlexProps & { lobbyId: string; userIsOwner: boolean }
> = ({ lobbyId, userIsOwner, ...props }) => {
  const lobby = useLobby(lobbyId);
  const { isActive, activate, deactivate } = useActiveLobby(lobbyId);
  return (
    <Flex
      bg={isActive ? "green.800" : "gray.700"}
      mt={4}
      p={4}
      minW="md"
      maxW="md"
      transition="background-color ease-in-out .15s"
      {...props}
    >
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
            value={lobby.id}
            isDisabled={lobby.loading}
            label="Copy lobby code to clipboard"
          >
            <Icon name="copy" />
          </CopyToClipboard>
          {userIsOwner ? (
            <PromptButton
              size="sm"
              onAccept={lobby.delete}
              actionLabel="Delete"
              promptLabel="Are you sure you want to delete this lobby? This action cannot be reversed"
              headerLabel={`Delete Lobby "${lobby.name}"`}
              isDisabled={lobby.loading}
            >
              <Icon name="delete" />
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
              <Icon name="delete" />
            </PromptButton>
          )}
          <Tooltip
            hasArrow
            label={
              isActive
                ? "Go back to public lobbies"
                : "Start playing in this lobby"
            }
            aria-label={
              isActive
                ? "Go back to public lobbies"
                : "Start playing in this lobby"
            }
          >
            <Button
              size="sm"
              variantColor={isActive ? "green" : "blue"}
              onClick={isActive ? deactivate : activate}
            >
              <Icon name={isActive ? "lock" : "unlock"} />
            </Button>
          </Tooltip>
        </Stack>
      </Flex>
    </Flex>
  );
};
