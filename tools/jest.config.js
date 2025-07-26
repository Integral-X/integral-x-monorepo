module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  testMatch: ["**/__tests__/**/*.spec.ts"],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
  // Increase timeout for build tests
  testTimeout: 180000, // 3 minutes
};
