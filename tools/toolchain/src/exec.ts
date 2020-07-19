import { join } from "path";
import { execSync } from "child_process";

export type AvailableBins = "tsc" | "rimraf";
type BinSpawner = (...args: string[]) => ReturnType<typeof execSync>;
type BinProxy = Record<AvailableBins, BinSpawner>;

const binRoot = join(__dirname, "..", "node_modules", ".bin");
export const exec = new Proxy({} as BinProxy, {
  get: (_, k) => (...args: string[]) =>
    execSync([join(binRoot, k as string), ...args].join(" "), {
      stdio: "inherit",
    }),
});
