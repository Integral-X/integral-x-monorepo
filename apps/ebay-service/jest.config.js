module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.ts'],
  moduleNameMapper: {
    "@integral-x/messaging": "<rootDir>/../../libs/messaging/src",
    "@integral-x/observability": "<rootDir>/../../libs/observability/src",
    "@integral-x/auth": "<rootDir>/../../libs/auth/src",
    "@integral-x/common": "<rootDir>/../../libs/common/src",
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
};
