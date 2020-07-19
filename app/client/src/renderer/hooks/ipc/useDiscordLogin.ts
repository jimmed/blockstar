import { useCallback, useMemo, useState } from "react";
import { useIpcRequest } from "./useIpc";
import { loginMutation } from "../graphql/mutation/login";

export enum OAuthStatus {
  INITIAL,
  GETTING_CODE,
  GETTING_CODE_FAILED,
  GETTING_TOKEN,
  GETTING_TOKEN_FAILED,
  LOGGED_IN,
}

const failureStates = new Set([
  OAuthStatus.GETTING_CODE_FAILED,
  OAuthStatus.GETTING_TOKEN_FAILED,
]);
const loadingStates = new Set([
  OAuthStatus.GETTING_CODE,
  OAuthStatus.GETTING_TOKEN,
]);

const hasFailed = (state: OAuthStatus) => failureStates.has(state);
const isLoading = (state: OAuthStatus) => loadingStates.has(state);

export interface State {
  readonly status: OAuthStatus;
  readonly code?: string | null;
  readonly token?: string | null;
}

const defaultInitialState: State = { status: OAuthStatus.INITIAL };

export interface DiscordOAuthHook extends State {
  readonly loading: boolean;
  readonly failed: boolean;
  readonly loggedIn: boolean;
  login(): Promise<void>;
  logout(): void;
}

export const useDiscordOAuth = (
  initialState: State = defaultInitialState
): DiscordOAuthHook => {
  // TODO: Migrate this data to apollo-client-state
  const [state, setState] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { status: OAuthStatus.LOGGED_IN, token } : initialState;
  });

  const getCode = useIpcRequest<void, string>("discord-login");
  const exchangeCodeForToken = loginMutation.use();

  const login = useCallback(async () => {
    setState({ status: OAuthStatus.GETTING_CODE });
    const code = await getCode();
    if (!code) {
      return setState({ status: OAuthStatus.GETTING_CODE_FAILED });
    }

    try {
      const result = await exchangeCodeForToken(code);
      const token = result.data?.login.token;
      if (!token) throw new Error("Could not get OAuth token");
      localStorage.setItem("token", token);
      setState({ status: OAuthStatus.LOGGED_IN, code: null, token });
    } catch (error) {
      console.error(error);
      setState({ status: OAuthStatus.GETTING_TOKEN_FAILED });
    }
  }, [getCode]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ status: OAuthStatus.INITIAL });
  }, []);

  const derivedState = useMemo(
    () => ({
      loading: isLoading(state.status),
      failed: hasFailed(state.status),
      loggedIn: state.status === OAuthStatus.LOGGED_IN,
    }),
    [state.status]
  );

  return useMemo(() => ({ ...state, ...derivedState, login, logout }), [
    state,
    derivedState,
    login,
    logout,
  ]);
};
