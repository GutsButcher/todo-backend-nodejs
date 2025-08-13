module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  testMatch: [
    '**/tests/unit/simple.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/db/mongoose.js'
  ],
  testTimeout: 10000,
  // Don't use any setup files that might connect to MongoDB
  setupFilesAfterEnv: []
}