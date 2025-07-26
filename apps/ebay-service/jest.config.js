module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  transform: {
    "^.+\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  testMatch: ["**/__tests__/**/*.ts"],
  moduleNameMapper: {
    redis: "<rootDir>/__mocks__/redis.ts",
    "class-validator": "<rootDir>/__mocks__/class-validator.ts",
  },
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
  setupFiles: ["./jest-setup.ts"],
};
