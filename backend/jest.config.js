/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/unit/**/*.test.js"],
  setupFiles: ["./tests/unit/setup/env.js"],
  clearMocks: true,
};
