module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}","!src/**/__tests__/**"],
  coverageReporters: ["text", "lcov", "json"],
  coverageThreshold: { 
    global: { 
      branches: 60, 
      functions: 60, 
      lines: 60, 
      statements: 60 
    } 
  },
  reporters: [
    "default",
    ["jest-junit", {
      outputDirectory: "reports/junit",
      outputName: "junit.xml"
    }]
  ],
  testMatch: ["**/tests/**/*.spec.js", "**/tests/**/*.test.js"],
  coverageDirectory: "coverage"
};
