// src/setupTests.js
import '@testing-library/jest-dom'; // Extends Jest assertions with DOM-related matchers


// jest.config.ts
export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  };
  