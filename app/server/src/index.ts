import { env } from "./lib/env";
import { createServer } from "./server";
export { createServer } from "./server";

if (!module.parent) {
  const port = Number(env.port ?? 3000);
  createServer().listen(port, () => {
    console.log(`Server listening on ${new URL(env.baseUrl!)}`);
  });
}
