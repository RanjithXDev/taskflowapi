# Grootan-Node-And-Testing-Exercise-Ranjith

## Name
Ranjith MV  

## Date
02 Mar 2026  

## Emp ID
G0180  

---

# Task Management API

A **Task Management REST API** built with **Node.js, Express, TypeScript, MongoDB, and Socket.IO**.  
This project provides authentication, task management, comments, attachments, and real-time updates.

---

# Features

- User Authentication (JWT based)
- Role-based authorization (Admin/User)
- Task CRUD operations
- Comment system for tasks
- File attachments upload
- Real-time updates using WebSockets
- Request validation
- Global error handling
- Unit & Integration testing with Jest
- Swagger API documentation

---

# Tech Stack

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- MongoDB
- Mongoose

## Authentication
- JWT (JSON Web Token)
- bcrypt

## Real-Time Communication
- Socket.IO

## File Upload
- Multer

## Validation
- express-validator / custom validators

## Testing
- Jest
- Supertest

## Documentation
- Swagger

---

# Project Structure

```
src
│
├── config
│   ├── db.ts
│   ├── avatarUpload.ts
│   └── attachmentUpload.ts
│
├── controllers
│   ├── auth.controller.ts
│   ├── task.controller.ts
│   ├── comment.controller.ts
│   └── user.controller.ts
│
├── middleware
│   ├── isAuth.ts
│   ├── isAdmin.ts
│   ├── errorHandler.ts
│   └── validateRequest.ts
│
├── models
│   ├── User.ts
│   ├── Task.ts
│   └── Comment.ts
│
├── routes
│   ├── auth.routes.ts
│   ├── task.routes.ts
│   ├── comment.routes.ts
│   └── user.routes.ts
│
├── services
│   ├── auth.services.ts
│   ├── task.services.ts
│   └── comment.services.ts
│
├── socket
│   └── socket.ts
│
├── validators
│   ├── user.validator.ts
│   └── task.validator.ts
│
├── utils
│
├── app.ts
└── server.ts
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/your-username/task-management-api.git
```

Move to project directory

```bash
cd task-management-api
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root folder.

```
PORT=5000

MONGO_URI=Your_mongodb_uri

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=1d
```

---

# Run the Project

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm run build
npm start
```

---

# Running Tests

Run all tests

```bash
npm test
```

Run tests with coverage

```bash
npm run test:coverage
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password |

---

## Users

| Method | Endpoint | Description |
|------|------|------|
| GET | /api/users | Get all users |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/users/:id/avatar | Get user avatar |

---

## Tasks

| Method | Endpoint | Description |
|------|------|------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## Task Attachments

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/tasks/:id/attachments | Upload attachment |
| GET | /api/tasks/:id/attachments | Get attachments |

Uploaded files are stored in:

```
uploads/attachments
```

---

## Comments

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/tasks/:taskId/comments | Add comment |
| GET | /api/tasks/:taskId/comments | Get comments |

---

# WebSocket Events

Socket.IO is used for **real-time task updates**.



---

# Validation

Requests are validated using **custom middleware**.

Example

```
validateRequest
```

Ensures required fields and proper input formats.

---

# Error Handling

Global error handler manages:

- Validation errors
- Authentication errors
- Database errors
- 404 routes
- Internal server errors

---

# Swagger Documentation

API documentation available at:

```
http://localhost:3000/api-docs
```

---

