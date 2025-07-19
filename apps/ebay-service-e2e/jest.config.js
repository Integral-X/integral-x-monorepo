module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.e2e-spec.ts"],
  rootDir: ".",
  moduleNameMapper: {
    "^@integral-x/messaging$": "<rootDir>/../../libs/messaging/src/index.ts",
    "^ebay-service/(.*)$": "<rootDir>/../../apps/ebay-service/src/$1",
  },
};
