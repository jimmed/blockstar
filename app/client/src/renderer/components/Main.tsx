import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
} from "@chakra-ui/core";
import React, { FC, useCallback } from "react";
import { currentUserQuery } from "../hooks/graphql/query/currentUser";
import { useIpAddresses } from "../hooks/ipc/useIpAddress";
import { CopyToClipboard } from "./CopyToClipboard";
import { LobbyControls } from "./LobbyControls";
import { LobbyList } from "./LobbyList";
import { UserAvatar } from "./UserAvatar";
import { Wrapper } from "./Wrapper";
import { shell } from "electron";

export const Main: FC<{ logout(): void }> = ({ logout }) => {
  const user = currentUserQuery.use();
  const ip = useIpAddresses();

  return (
    <Wrapper>
      <Flex bg="gray.700" borderColor="gray.900" borderWidth={1}>
        <Skeleton isLoaded={!user.loading}>
          {user.error ? (
            <Alert
              status="error"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              minW="xl"
              minH="xs"
              maxW="100%"
              bg="red.900"
              color="red.100"
            >
              <AlertIcon size="40px" mr={0} mt={4} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Something went wrong!
              </AlertTitle>
              <AlertDescription maxW="sm">
                {user.error.message}
              </AlertDescription>
            </Alert>
          ) : (
            <Stack minW="md">
              <Stack direction="row" alignItems="center" p={4}>
                <UserAvatar user={user} size="lg" m={2} />
                <Box flexGrow={1}>
                  <Heading color="gray.200" size="md" m={2}>
                    {user.username}
                    <code style={{ fontWeight: "normal" }}>
                      #{user.discriminator}
                    </code>
                  </Heading>
                  <Stack direction="row" mx={1}>
                    <CopyToClipboard
                      value={ip.ipv4}
                      size="xs"
                      variant="link"
                      mx={1}
                      showValueInTooltip
                    >
                      IPv4
                    </CopyToClipboard>
                    <CopyToClipboard
                      value={ip.ipv6}
                      size="xs"
                      variant="link"
                      mx={1}
                      showValueInTooltip
                    >
                      IPv6
                    </CopyToClipboard>
                    <Button onClick={logout} size="xs" variant="link" mx={1}>
                      Logout
                    </Button>
                  </Stack>
                </Box>
                <Button
                  m={2}
                  variantColor="green"
                  onClick={useCallback(() => {
                    shell.openExternal(
                      `steam://run/271590//-StraightIntoFreeMode -online/`
                    );
                  }, [])}
                >
                  Launch GTA
                </Button>
              </Stack>
            </Stack>
          )}
        </Skeleton>
      </Flex>
      <Skeleton isLoaded={!user.loading}>
        <LobbyList />
      </Skeleton>
      <Flex bg="gray.700" mt={4} p={4} minW="md">
        <LobbyControls />
      </Flex>
    </Wrapper>
  );
};
