# Todo Backend API Usage Guide

This is a REST API backend for todo applications. You can interact with it using:
- curl commands (terminal)
- Postman (GUI tool)
- Any HTTP client
- Your own frontend application

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require a JWT token. Include it in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### 1. User Registration (Sign Up)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Task (Requires Auth)
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Buy groceries",
    "completed": false
  }'
```

### 4. Get All Tasks (Requires Auth)
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Task by ID (Requires Auth)
```bash
curl -X GET http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Update Task (Requires Auth)
```bash
curl -X PATCH http://localhost:3000/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "completed": true
  }'
```

### 7. Delete Task (Requires Auth)
```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Get User Profile (Requires Auth)
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 9. Logout (Requires Auth)
```bash
curl -X POST http://localhost:3000/users/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 10. Logout from All Devices (Requires Auth)
```bash
curl -X POST http://localhost:3000/users/logoutAll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Quick Start Example

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test1234"}'
```

2. **Save the token from the response**

3. **Create your first task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"description":"My first task"}'
```

4. **View all your tasks:**
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import the collection from: https://documenter.getpostman.com/view/6519027/SVtN3B8u
3. Set your JWT token in the Authorization tab
4. Start making requests!

## Building a Frontend

You can build a frontend using any framework (React, Vue, Angular, etc.) that makes HTTP requests to these endpoints. The API supports CORS, so you can run your frontend on a different port.