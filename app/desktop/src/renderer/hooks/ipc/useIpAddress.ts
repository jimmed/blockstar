import { useCallback, useState, useEffect } from "react";
import { useIpcRequest } from "./useIpc";

interface IPAddresses {
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
  useEffect(() => {
    getIps().then(setIps, console.error);
  }, []);
  return ips;
};
