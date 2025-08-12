module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/db/mongoose.js'
  ],
  testTimeout: 30000
}