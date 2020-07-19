import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
} from "@chakra-ui/core";
import React, { FC } from "react";
import { DiscordOAuthHook, OAuthStatus } from "../hooks/ipc/useDiscordLogin";
import { Logo } from "./Logo";
import { Wrapper } from "./Wrapper";

export const Login: FC<{ oAuth: DiscordOAuthHook }> = ({ oAuth }) => (
  <Wrapper>
    <Flex
      direction="column"
      bg="gray.700"
      borderColor="gray.900"
      borderWidth={1}
      p={4}
    >
      <Logo size="xl" m={4} textAlign="center" />
      <Button
        variantColor="blue"
        size="lg"
        m={4}
        onClick={oAuth.login}
        loadingText={
          oAuth.status === OAuthStatus.GETTING_CODE
            ? "Logging in with Discord"
            : "Logging in to Kuruma"
        }
        isLoading={oAuth.loading}
      >
        Login with Discord
      </Button>
      {oAuth.failed && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            {oAuth.status === OAuthStatus.GETTING_CODE_FAILED
              ? "Unable to login with Discord"
              : "Unable to login to Kuruma"}
          </AlertTitle>
          <AlertDescription>
            {oAuth.status === OAuthStatus.GETTING_CODE_FAILED
              ? "Did you close the window before you finished logging in?"
              : "Check your internet connection and try again"}
          </AlertDescription>
        </Alert>
      )}
    </Flex>
  </Wrapper>
);
