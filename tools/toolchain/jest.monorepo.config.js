const { join } = require("path");
const { projects } = require("../../rush.json");

// TODO: Move whole thing to TypeScript
const requireOptional = (path, defaultRes = {}) => {
  try {
    return require(path);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      return defaultRes;
    }
    throw error;
  }
};

module.exports = {
  projects: projects
    .map((project) => ({
      ...project,
      rootDir: join(__dirname, "..", "..", project.projectFolder),
    }))
    .filter(({ rootDir }) => {
      const pkg = require(join(rootDir, "package.json"));
      return (
        pkg.scripts &&
        pkg.scripts.test &&
        pkg.scripts.test.match(/^jest(?:\s.+)?$/)
      );
    })
    .map(({ rootDir, packageName }) => {
      const jestCfg = requireOptional(join(rootDir, "jest.config.js"));
      return {
        globals: {
          "ts-jest": {
            packageJson: join(rootDir, "package.json"),
          },
        },
        rootDir,
        displayName: packageName.replace(/^\@scarlet\//g, ""),
        preset: "ts-jest",
        modulePaths: ["<rootDir>/node_modules"],
        testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts?(x)"],
        ...jestCfg,
      };
    }),
};
