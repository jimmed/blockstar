import { Flex, FlexProps } from "@chakra-ui/core";
import { v4 as validateUuid } from "is-uuid";
import React, { FC } from "react";
import { useLobbies } from "../hooks/useLobbies";
import { InputPromptButton } from "./InputPromptButton";

export const LobbyControls: FC<FlexProps> = (props) => {
  const lobbies = useLobbies();
  return (
    <Flex direction="row" justifyContent="stretch" w="100%">
      <InputPromptButton
        onAccept={lobbies.createNew}
        actionLabel="Create"
        variantColor="blue"
        size="md"
        mr={2}
        w="50%"
        inputProps={{ placeholder: "Lobby name" }}
      >
        Create New Lobby
      </InputPromptButton>
      <InputPromptButton
        onAccept={lobbies.joinExisting}
        actionLabel="Join"
        variantColor="blue"
        size="md"
        w="50%"
        inputProps={{
          placeholder: "Lobby code",
          fontFamily: "monospace",
          maxLength: 36,
        }}
        validate={validateUuid}
      >
        Join Existing Lobby
      </InputPromptButton>
    </Flex>
  );
};
