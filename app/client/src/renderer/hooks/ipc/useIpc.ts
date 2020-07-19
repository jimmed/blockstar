import { ipcRenderer } from "electron";
import { useCallback, useEffect, useRef } from "react";

export const useIpcSend = <P>(channel: string) =>
  useCallback((payload: P) => ipcRenderer.send(channel, payload), [channel]);

export const useIpcReceive = <P>(
  channel: string,
  onMessageReceived: (payload: P) => void
) =>
  useEffect(() => {
    const callback = (_: any, payload: P) => onMessageReceived(payload);
    ipcRenderer.on(channel, callback);
    return () => {
      ipcRenderer.off(channel, callback);
    };
  }, [channel, onMessageReceived]);

export const useIpcRequest = <Request, Response>(channel: string) => {
  const lastId = useRef(0);

  const { current: callbacks } = useRef(
    new Map<number, (response: Response) => void>()
  );

  const send = useIpcSend<{ id: number; payload: Request }>(channel);

  useIpcReceive<{ id: number; payload: Response }>(
    channel,
    useCallback(({ id, payload }) => {
      callbacks.get(id)!(payload);
      callbacks.delete(id);
    }, [])
  );

  return useCallback(
    (request: Request) => {
      const id = lastId.current++;
      return new Promise<Response>((resolve) => {
        callbacks.set(id, resolve);
        send({ id, payload: request });
      });
    },
    [channel]
  );
};
