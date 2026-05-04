/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/integration/**/*.test.js"],
  clearMocks: true,
  testTimeout: 30000,
};
