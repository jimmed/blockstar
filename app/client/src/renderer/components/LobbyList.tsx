import { Flex, FlexProps, Text } from "@chakra-ui/core";
import React, { FC } from "react";
import { useLobbies } from "../hooks/useLobbies";
import { LobbyCard } from "./LobbyCard";

export const LobbyList: FC<FlexProps> = ({ ...props }) => {
  const { all } = useLobbies();
  return (
    <>
      {all?.length ? (
        all?.map((lobby) => (
          <LobbyCard
            key={lobby.id}
            lobbyId={lobby.id}
            userIsOwner={lobby.userIsOwner}
          />
        ))
      ) : (
        <Flex
          bg="gray.700"
          mt={4}
          p={4}
          minW="md"
          maxW="md"
          justifyContent="center"
          {...props}
        >
          <Text color="gray.400" fontSize="lg">
            Create or join a lobby to get started
          </Text>
        </Flex>
      )}
    </>
  );
};
