module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "process.env.NODE_ENV": "test",
  },
  rootDir: ".",
  testMatch: ["**/__tests__/**/*.ts"],
  moduleNameMapper: {
    "^@integral-x/messaging$":
      "<rootDir>/../../libs/messaging/src/__mocks__/index.ts",
    "^@integral-x/messaging/src/messaging.module.mock$":
      "<rootDir>/../../libs/messaging/src/messaging.module.mock.ts",
    "@integral-x/observability": "<rootDir>/../../libs/observability/src",
    "@integral-x/auth": "<rootDir>/../../libs/auth/src",
    "@integral-x/common": "<rootDir>/../../libs/common/src",
  },
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
  setupFilesAfterEnv: ["./jest-setup.ts"],
};
