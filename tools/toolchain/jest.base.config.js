module.exports = {
  preset: "ts-jest",
  modulePaths: ["<rootDir>/node_modules"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.ts?(x)",
    "<rootDir>/src/**/?(*.)+test.ts?(x)",
  ],
};
