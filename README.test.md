# Unit Testing Setup for Todo Backend

This project now includes comprehensive unit and integration tests using Jest.

## Test Structure

```
tests/
├── unit/               # Unit tests for models and middleware
│   ├── user.test.js    # User model tests
│   ├── task.test.js    # Task model tests
│   └── auth.test.js    # Auth middleware tests
├── integration/        # Integration tests for API endpoints
│   ├── user.test.js    # User route tests
│   └── task.test.js    # Task route tests
├── fixtures/           # Test data and database setup
│   └── db.js          # Test fixtures and database helpers
└── setup.js           # Jest setup file
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Environment

Tests use a separate test database configured in `config/test.env`:
- Port: 3001
- Database: task-manager-test
- JWT Secret: testjwtsecret123

## CI/CD Integration

You can now add a testing step to your CI/CD pipeline:

```yaml
# Example for GitHub Actions
- name: Run Tests
  run: npm test

# Example for GitLab CI
test:
  script:
    - npm install
    - npm test
```

## Coverage

The test suite covers:
- User model validation and methods
- Task model validation and relationships
- JWT authentication middleware
- All user API endpoints (signup, login, profile, update, delete)
- All task API endpoints (create, read, update, delete, filtering)

## Notes

- Tests run with `--runInBand` to avoid concurrent database access issues
- Integration tests use supertest for HTTP assertions
- Test database is cleaned before each test for isolation