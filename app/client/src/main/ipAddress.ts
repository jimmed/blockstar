import { v4, v6 } from "public-ip";
import { ipcListener } from "./ipc";

export const listenForIpAddress = () =>
  ipcListener<void, { ipv4: string | null; ipv6: string | null }>(
    "ip-address",
    async () => {
      try {
        const [ipv4, ipv6] = await Promise.all(
          [v4, v6].map((get) => get({ onlyHttps: true }))
        );
        return { ipv4, ipv6 };
      } catch (e) {
        console.error(e);
        return { ipv4: null, ipv6: null };
      }
    }
  );
