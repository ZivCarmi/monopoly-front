module.exports = {
  testEnvironment: "jsdom", // For testing DOM-related features
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"], // Setup after environment
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JS/JSX files using Babel
  },
  transformIgnorePatterns: ["/node_modules/"], // Ignore node_modules
};
