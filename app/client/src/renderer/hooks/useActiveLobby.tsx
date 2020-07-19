import React, {
  useCallback,
  useMemo,
  useState,
  createContext,
  FC,
  useContext,
  useEffect,
} from "react";
import { updateIpAddressMutation } from "./graphql/mutation/setIpAddress";
import { useIpAddresses } from "./ipc/useIpAddress";

interface ActiveLobbyContextValue {
  activeLobbyId: string | null;
  activate(id: string): void;
  deactivate(): void;
}

export const ActiveLobbyContext = createContext<ActiveLobbyContextValue>(
  {} as ActiveLobbyContextValue
);

export const ActiveLobbyProvider: FC = ({ children }) => {
  const [activeLobbyId, setActiveLobbyId] = useState<string | null>(null);

  const activate = useCallback((id: string) => setActiveLobbyId(id), []);
  const deactivate = useCallback(() => setActiveLobbyId(null), []);

  const contextValue = useMemo(
    () => ({ activate, deactivate, activeLobbyId }),
    [activate, deactivate, activeLobbyId]
  );

  const updateIpAddress = updateIpAddressMutation.use();
  const ipAddresses = useIpAddresses();

  useEffect(() => {
    if (!activeLobbyId) return;
    console.info("Updating IP addresses", ipAddresses);
    updateIpAddress(ipAddresses);
  }, [activeLobbyId, ipAddresses]);

  return (
    <ActiveLobbyContext.Provider value={contextValue}>
      {children}
    </ActiveLobbyContext.Provider>
  );
};

export const useActiveLobby = (lobbyId: string) => {
  const activeLobby = useContext(ActiveLobbyContext);
  const activate = useCallback(() => activeLobby.activate(lobbyId), [lobbyId]);
  const isActive = activeLobby.activeLobbyId === lobbyId;
  return useMemo(
    () => ({ isActive, deactivate: activeLobby.deactivate, activate }),
    [isActive, activeLobby.deactivate, activate]
  );
};
