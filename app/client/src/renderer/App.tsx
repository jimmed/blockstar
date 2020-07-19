import { ApolloProvider } from "@apollo/react-hooks";
import {
  CSSReset,
  theme,
  ThemeProvider,
  ColorModeProvider,
  DarkMode,
} from "@chakra-ui/core";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ipcRenderer } from "electron";
import { createIpcLink } from "graphql-transport-electron";
import React, { FC } from "react";
import { Login } from "./components/Login";
import { Main } from "./components/Main";
import { useDiscordOAuth } from "./hooks/ipc/useDiscordLogin";
import { setContext } from "apollo-link-context";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  }).concat(createIpcLink({ ipc: ipcRenderer })),
  queryDeduplication: false,
});

export const Root: FC = () => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <style type="text/css">{`html, body, #app { min-height: 100%; height: 100% }`}</style>
    <ColorModeProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ColorModeProvider>
  </ThemeProvider>
);

export const App: FC = () => {
  const oAuth = useDiscordOAuth();
  return (
    <DarkMode>
      {oAuth.loggedIn ? (
        <Main logout={oAuth.logout} />
      ) : (
        <Login oAuth={oAuth} />
      )}
    </DarkMode>
  );
};
