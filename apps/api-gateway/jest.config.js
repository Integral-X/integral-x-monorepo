module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.ts'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
}; 