/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/integration/**/*.test.js"],
  setupFiles: ["./tests/integration/setup/env.js"],
  clearMocks: true,
  testTimeout: 30000,
};
