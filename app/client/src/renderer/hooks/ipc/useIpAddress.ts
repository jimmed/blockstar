import { useCallback, useState, useEffect } from "react";
import { useIpcRequest } from "./useIpc";

export interface IPAddresses {
  ipv4?: string | null;
  ipv6?: string | null;
}

export const useGetIpAddresses = () => {
  const getIps = useIpcRequest<void, IPAddresses>("ip-address");
  return useCallback(() => getIps(), [getIps]);
};

export const useIpAddresses = () => {
  const [ips, setIps] = useState<IPAddresses>({ ipv4: null, ipv6: null });
  const getIps = useGetIpAddresses();
  const updateIps = useCallback(() => getIps().then(setIps, console.error), [
    getIps,
  ]);
  useEffect(() => {
    updateIps();
    const timer = setInterval(updateIps, 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  return ips;
};
