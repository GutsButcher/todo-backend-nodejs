# Todo CLI - Go Client Example

A simple command-line interface written in Go that interacts with the Todo Backend API.

## Build

```bash
cd example-go-cli
go build -o todo main.go
```

## Usage

### 1. Register a new user
```bash
./todo register "John Doe" john@example.com password123
```

### 2. Login
```bash
./todo login john@example.com password123
# Save the token that's returned!
```

### 3. Add a task
```bash
./todo add YOUR_TOKEN "Buy groceries"
```

### 4. List all tasks
```bash
./todo list YOUR_TOKEN
```

### 5. Complete a task
```bash
./todo complete YOUR_TOKEN TASK_ID
```

## Example Session

```bash
# Register
$ ./todo register "Alice Smith" alice@example.com alice123
Registration successful!
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add some tasks
$ ./todo add eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... "Learn Go"
Task added successfully!
ID: 507f1f77bcf86cd799439011
Description: Learn Go

$ ./todo add eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... "Build CLI tool"
Task added successfully!
ID: 507f1f77bcf86cd799439012
Description: Build CLI tool

# List tasks
$ ./todo list eyJhbGciOiJIUzI5NiIsInR5cCI6IkpXVCJ9...
Your Tasks:
===========
1. [ ] Learn Go (ID: 507f1f77bcf86cd799439011)
2. [ ] Build CLI tool (ID: 507f1f77bcf86cd799439012)

# Complete a task
$ ./todo complete eyJhbGciOiJIUzI5NiIsInR5cCI6IkpXVCJ9... 507f1f77bcf86cd799439011
Task marked as complete!

# List again
$ ./todo list eyJhbGciOiJIUzI5NiIsInR5cCI6IkpXVCJ9...
Your Tasks:
===========
1. [X] Learn Go (ID: 507f1f77bcf86cd799439011)
2. [ ] Build CLI tool (ID: 507f1f77bcf86cd799439012)
```

## Improvements You Could Make

1. **Token Storage**: Save the token to a config file so users don't have to pass it every time
2. **Better Error Handling**: Add more detailed error messages
3. **More Commands**: Add delete, update description, logout, etc.
4. **Interactive Mode**: Create an interactive shell mode
5. **Colored Output**: Use a library like `fatih/color` for better visual feedback
6. **Table Format**: Display tasks in a nice table format
7. **Config File**: Store the API base URL in a config file