import { split, Operation } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ipcMain } from "electron";
import fetch from "electron-fetch";
import { createIpcExecutor } from "graphql-transport-electron";
import WebSocket from "ws";
import { setContext } from "apollo-link-context";

class TestWebSocketLink extends WebSocketLink {
  constructor(...args: ConstructorParameters<typeof WebSocketLink>) {
    super(...args);
    console.log("LINK", args);
  }

  request(operation: Operation) {
    console.log("OP", operation);
    return super.request(operation);
  }
}

export const listenForGraphQL = (uri: string) => {
  // FIXME: Find a better way of passing auth token to websocket link
  let authToken: string;

  const httpLink = setContext((_, context) => {
    authToken = context.headers.authorization?.replace(/^Bearer\s+/, "");
  }).concat(
    new HttpLink({
      uri,
      // @ts-expect-error
      fetch,
      fetchOptions: { useElectronNet: false },
    })
  );

  const wsLink = new TestWebSocketLink({
    uri: uri.replace(/^http/, "ws"),
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: () => ({ authToken }),
    },
    webSocketImpl:
      process.env.NODE_ENV === "production"
        ? WebSocket
        : class TestWS extends WebSocket {
            constructor(...args: ConstructorParameters<typeof WebSocket>) {
              super(...args);
              this.on("error", (error) => console.error("Error", error));
              this.on("message", (message) => console.log("Message", message));
            }
          },
  });

  createIpcExecutor({
    link: split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    ),
    ipc: ipcMain,
  });
};
