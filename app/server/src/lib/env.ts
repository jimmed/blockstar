import { envCase } from "./envCase";
import { config } from "dotenv";

config();

/**
 * An object that allows access to environment variables using
 * camel-case keys.
 *
 * Given an env like:
 *
 * ```env
 * PORT=3000
 * API_ROOT=http://localhost:4000
 * ```
 *
 * you can access these values using:
 *
 * ```ts
 * const { port, apiRoot } = env
 * ```
 */
export const env = new Proxy(process.env, {
  get: (env, key: string) => {
    const value = env[key] ?? env[envCase(key)];
    if (value == null) {
      throw new Error(`Environment variable ${envCase(key)} is not defined`);
    }
    return value;
  },
});
