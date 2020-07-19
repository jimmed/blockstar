import { ipcMain } from "electron";

export const ipcListener = <Request, Response>(
  channel: string,
  handler: (request: Request) => Response | Promise<Response>
) => {
  ipcMain.on(channel, async (event, { id, payload }) => {
    if (event.sender.isDestroyed()) return;
    event.reply(channel, { id, payload: await handler(payload) });
  });
};
