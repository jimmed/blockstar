import * as Listr from "listr";
import { promises as fs } from "fs";
import { resolve } from "path";
import { URL } from "url";

const flags = ["path", "name"];
const { path, name } = process.argv.reduce((o, arg, i, l) => {
  flags
    .filter((flag) => arg === `--${flag}`)
    .forEach((flag) => {
      o[flag] = l[i + 1];
    });
  return o;
}, {} as Record<typeof flags[any], string | undefined>);

if (!path) throw new Error("--path must be specified");
if (!name) throw new Error("--name must be specified");

const rootDir = resolve(__dirname, "../../..");
const packageDir = resolve(rootDir, path);
const rushJson = resolve(rootDir, "rush.json");

new Listr([
  {
    title: "Read existing rush.json",
    task: async (ctx) => {
      ctx.rush = JSON.parse(await fs.readFile(rushJson, "utf8"));
    },
  },
  {
    title: "Create directory",
    task: () => fs.mkdir(packageDir, { recursive: true }),
  },
  {
    title: "Create package.json",
    task: (ctx) =>
      fs.writeFile(
        resolve(packageDir, "package.json"),
        JSON.stringify(
          {
            name,
            version: "1.0.0",
            scripts: { build: "build-ts", test: "jest" },
            repository: {
              type: "git",
              url: ctx.rush.repository.url + ".git",
              directory: path,
            },
            devDependencies: {
              "@scope/toolchain": "1.0.0",
              "@types/jest": "~25.2.1",
              "@types/node": "~13.13.5",
              jest: "~25.5.4",
              rimraf: "~3.0.2",
              "ts-jest": "~25.4.0",
              typescript: "~3.8.3",
            },
          },
          null,
          2
        ),
        "utf8"
      ),
  },
  {
    title: "Create tsconfig.json",
    task: () =>
      fs.writeFile(
        resolve(packageDir, "tsconfig.json"),
        JSON.stringify(
          {
            extends: "@scope/toolchain/tsconfig.json",
            compilerOptions: {
              rootDir: "src",
              outDir: "dist",
            },
            include: ["src/**/*.ts"],
            exclude: ["node_modules", "dist"],
          },
          null,
          2
        ),
        "utf8"
      ),
  },
  {
    title: "Creating jest.config.js",
    task: () =>
      fs.writeFile(
        resolve(packageDir, "jest.config.js"),
        'module.exports = require("@scope/toolchain/jest.base.config")',
        "utf8"
      ),
  },
  {
    title: "Create src directory",
    task: () =>
      fs.mkdir(resolve(packageDir, "src/__tests__"), { recursive: true }),
  },
  {
    title: "Updating rush.json",
    task: (ctx) => {
      ctx.rush.projects.push({
        packageName: name,
        projectFolder: path,
      });
      return fs.writeFile(rushJson, JSON.stringify(ctx.rush, null, 2), "utf8");
    },
  },
])
  .run()
  .then(
    () => {
      console.log(`New package ${name} has been created at ${path}`);
      console.log("You should run `rush update` to link node_modules");
    },
    (error) => {
      console.error(error.stack);
      process.exit(1);
    }
  );
