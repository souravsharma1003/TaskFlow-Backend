# TaskFlow

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/Code%20Style-Airbnb-red)](https://github.com/airbnb/javascript)

A comprehensive task and project management API built with Node.js and Express.js. TaskFlow enables users to create, organize, and manage projects with associated tasks efficiently.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with cookie support
- **Project Management**: Create and manage multiple projects
- **Task Management**: Create, update, and track tasks within projects
- **Role-Based Access**: User authentication and authorization
- **Error Handling**: Comprehensive error handling with custom error utilities
- **REST API**: Clean, RESTful API design following HTTP standards
- **Security**: Built-in security middleware for XSS and CSRF protection
- **Scalable Architecture**: Modular route-based architecture for easy scaling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn v1.22.0+)
- **Git**: v2.20.0 or higher
- **MongoDB** (if using MongoDB): v4.4 or higher
- **PostgreSQL** (if using PostgreSQL): v12 or higher

Verify your installations:
```bash
node --version    # v14.0.0+
npm --version     # v6.0.0+
git --version     # v2.20.0+
```

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/TaskFlow.git
cd TaskFlow
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit `.env` with your configuration (see [Configuration](#configuration) section).

### Step 5: Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

Verify the server is running:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK"
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/taskflow
# OR for PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/taskflow

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cookie Configuration
COOKIE_SECURE=false  # Set to true in production with HTTPS
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict

# Logging
LOG_LEVEL=debug

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Environment

For production, create a `.env.production` file:

```env
PORT=3000
NODE_ENV=production

DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://yourdomain.com

COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict

LOG_LEVEL=info
```

## 📁 Project Structure

```
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.route.js        # Authentication endpoints
│   │   │   ├── project.route.js     # Project management endpoints
│   │   │   └── task.route.js        # Task management endpoints
│   │   ├── controllers/             # Business logic handlers
│   │   ├── middleware/              # Custom middleware
│   │   ├── models/                  # Database schemas
│   │   ├── utils/
│   │   │   └── ExpressError.util.js # Custom error handler
│   │   └── app.js                   # Express app configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Server entry point
├── frontend/                        # React frontend (if applicable)
├── .gitignore
├── .eslintrc
├── .prettierrc
└── README.md
```

## 🔌 API Documentation

### Base URL

```
http://localhost:5000
```

### Health Check

Verify API is running:

```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "OK"
}
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookies Set:**
- `authToken`: JWT token for authentication
- `refreshToken`: Token for refreshing authentication

### Logout User

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 📊 Project Endpoints

### Get All Projects

```http
GET /projects
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Items per page (default: 10)
- `sort` (string, optional): Sort by field (e.g., `createdAt`, `-updatedAt`)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "proj001",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "owner": "user123",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### Get Project by ID

```http
GET /projects/:projectId
Authorization: Bearer <token>
```

**URL Parameters:**
- `projectId` (string, required): The unique project identifier

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "proj001",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner": "user123",
    "members": ["user123", "user456"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Project not found"
}
```

### Create New Project

```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete redesign of company website"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "proj001",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner": "user123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Project name is required"
}
```

### Update Project

```http
PUT /projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign v2",
  "description": "Updated description"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "proj001",
    "name": "Website Redesign v2",
    "description": "Updated description",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
}
```

### Delete Project

```http
DELETE /projects/:projectId
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## ✅ Task Endpoints

### Get All Tasks in a Project

```http
GET /projects/:projectId/tasks
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`)
- `assignee` (string, optional): Filter by assignee user ID
- `dueDate` (string, optional): Filter by due date (ISO format)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task001",
      "projectId": "proj001",
      "title": "Design homepage",
      "description": "Create modern homepage design",
      "status": "in-progress",
      "priority": "high",
      "assignee": "user456",
      "dueDate": "2024-02-01T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-18T14:30:00Z"
    }
  ],
  "pagination": {
    "totalTasks": 15,
    "currentPage": 1,
    "totalPages": 2
  }
}
```

**Example Request with Pagination:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/projects/proj001/tasks?page=2&limit=5"
```

### Get Task by ID

```http
GET /projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task001",
    "projectId": "proj001",
    "title": "Design homepage",
    "description": "Create modern homepage design",
    "status": "in-progress",
    "priority": "high",
    "assignee": "user456",
    "tags": ["design", "urgent"],
    "dueDate": "2024-02-01T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-18T14:30:00Z"
  }
}
```

### Create New Task

```http
POST /projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create modern homepage design",
  "priority": "high",
  "assignee": "user456",
  "dueDate": "2024-02-01"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task001",
    "projectId": "proj001",
    "title": "Design homepage",
    "status": "pending",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Task

```http
PUT /projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage and footer",
  "status": "in-progress",
  "priority": "medium"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task001",
    "title": "Design homepage and footer",
    "status": "in-progress",
    "priority": "medium",
    "updatedAt": "2024-01-18T14:30:00Z"
  }
}
```

### Delete Task

```http
DELETE /projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 🔐 Authentication

### JWT Token Structure

The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies and can also be sent via the `Authorization` header.

**Token Format:**
```
Authorization: Bearer <jwt_token>
```

**Token Claims:**
```json
{
  "userId": "user123",
  "email": "john@example.com",
  "iat": 1674835200,
  "exp": 1675440000
}
```

### Token Expiration

- Access Token: 7 days (configurable via `JWT_EXPIRE`)
- Refresh Token: 30 days (configurable)

### Using Tokens

**With Authorization Header:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/projects
```

**With Cookies:**
```bash
curl -b "authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/projects
```

---

## ⚠️ Error Handling

### Error Response Format

All error responses follow this standard format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

### Common Error Scenarios

**Missing Authorization Token (401):**
```json
{
  "error": "Unauthorized"
}
```

**Invalid Token (401):**
```json
{
  "error": "Invalid token"
}
```

**Resource Not Found (404):**
```json
{
  "error": "Project not found"
}
```

**Validation Error (400):**
```json
{
  "error": "Project name is required"
}
```

**Server Error (500):**
```json
{
  "error": "Internal Server Error"
}
```

---

## 🚢 Deployment

### Heroku Deployment

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku App:**
   ```bash
   heroku create taskflow-app
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_production_secret
   heroku config:set DATABASE_URL=your_database_url
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **View Logs:**
   ```bash
   heroku logs --tail
   ```

### Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package.json .
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build Docker Image:**
   ```bash
   docker build -t taskflow:latest .
   ```

3. **Run Docker Container:**
   ```bash
   docker run -p 5000:5000 --env-file .env taskflow:latest
   ```

### AWS EC2 Deployment

1. **SSH into EC2 instance:**
   ```bash
   ssh -i key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **Clone and Setup:**
   ```bash
   git clone https://github.com/yourusername/TaskFlow.git
   cd TaskFlow
   npm install
   ```

4. **Use PM2 for Process Management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "taskflow" -- start
   pm2 startup
   pm2 save
   ```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Example Test Structure

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 🔧 Troubleshooting

### Issue: Cannot find module 'express'

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use

**Solution:**
```bash
# Linux/Mac: Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Database connection error

**Solution:**
1. Verify DATABASE_URL in `.env`
2. Ensure database server is running
3. Check database credentials
4. Verify network connectivity

### Issue: JWT token invalid

**Solution:**
1. Verify JWT_SECRET matches in `.env`
2. Check token expiration time
3. Ensure token is not malformed
4. Try re-authenticating with login endpoint

### Getting Help

- Check logs: `npm run dev` and look for error messages
- Review error responses: API returns descriptive error messages
- GitHub Issues: Open an issue for bugs or feature requests

---

## 🔒 Security

### Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random secrets in production
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: All inputs are validated
6. **CORS**: Configure CORS properly for your domain
7. **SQL Injection**: Use parameterized queries
8. **XSS Prevention**: Sanitize user inputs
9. **CSRF Protection**: Use CSRF tokens
10. **Dependency Security**: Run `npm audit` regularly

### Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS
- [ ] Set COOKIE_SECURE=true in production
- [ ] Configure proper CORS_ORIGIN
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting
- [ ] Enable request logging
- [ ] Use strong password requirements
- [ ] Regular security updates

---

## 📦 Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with hot reload
npm test               # Run test suite
npm run test:coverage  # Run tests with coverage report
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm audit              # Check for vulnerabilities
npm run build          # Build for production
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### 1. Fork the Repository

```bash
git clone https://github.com/yourusername/TaskFlow.git
cd TaskFlow
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: Add amazing feature"
```

### 4. Push to Branch

```bash
git push origin feature/AmazingFeature
```

### 5. Open a Pull Request

- Provide clear description of changes
- Reference related issues
- Ensure tests pass
- Update documentation

### Code Style

- Follow Airbnb JavaScript style guide
- Use ESLint for consistency
- Format code with Prettier
- Write meaningful commit messages

```bash
npm run lint:fix
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **SOURAV SHARMA** - Initial work - [GitHub](https://github.com/souravsharma1003)

---

## 📧 Support

For support, email souravsharma1003@gmail.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- Express.js community
- Node.js documentation
- All contributors

---

**Last Updated:** January 2026
**Version:** 1.0.0

---

Made with ❤️ by TaskFlow Team

---

## 🔄 Data Flow: Requests, Responses & Frontend Integration

This section explains how the API expects requests, how responses are structured, and short frontend examples showing how to consume those responses.

### How the API consumes requests
- Content-Type: JSON for request bodies (POST/PUT).
- Auth:
  - Prefer HttpOnly cookies (authToken / refreshToken) for security.
  - Or send Authorization header: `Authorization: Bearer <token>`.
- Common request fields:
  - Auth endpoints: { name?, email, password }
  - Projects: { name, description }
  - Tasks: { title, description, priority, assignee, dueDate }
- Query parameters for listing endpoints: `page`, `limit`, `sort`, `status`, `priority`, etc.

### Response conventions
- Success responses usually include top-level fields:
  - `{ success: true, message?: string, data?: object|array, pagination?: {...} }`
- Errors follow:
  - `{ error: "Error message" }` and appropriate HTTP status codes (401, 400, 404, 500).
- Pagination example:
  - `{ data: [...], pagination: { page, limit, total } }`

### Frontend usage patterns

1) Login (store token or rely on cookies)
- Using cookies (HttpOnly): send credentials, server sets cookies. Use `credentials: 'include'` in fetch.
- Using token in response: store token in memory or secure storage (avoid localStorage for high-sensitivity apps).

fetch example (cookies):
```js
// Use credentials: 'include' to allow HttpOnly cookies
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include'
}).then(r => r.json()).then(res => {
  if (res.error) throw new Error(res.error);
  // server may set HttpOnly cookie; user info may be in res.data
});
```

axios example (token header):
```js
// Assuming login returns token in res.data.token
const res = await axios.post('/auth/login', { email, password });
const token = res.data?.data?.token;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

2) Fetch projects (handle pagination and errors)
```js
// Fetch with token header or credentials
const res = await fetch(`/projects?page=1&limit=10`, {
  headers: { 'Authorization': `Bearer ${token}` } // or credentials:'include'
});
const body = await res.json();
if (body.error) { /* handle error */ }
setProjects(body.data);
setPagination(body.pagination);
```

3) Create task and optimistic update
```js
// Optimistic UI: append a temp task immediately, then confirm with server
const tempTask = { id: 'tmp-' + Date.now(), title, status: 'pending' };
setTasks(prev => [tempTask, ...prev]);
try {
  const res = await api.post(`/projects/${projectId}/tasks`, { title, ... });
  // replace tempTask with server response
  replaceTempWithServerTask(res.data);
} catch (e) {
  // rollback on error
  setTasks(prev => prev.filter(t => t.id !== tempTask.id));
}
```

4) Handling 401 / refresh token
- On 401: attempt to call refresh endpoint using refresh cookie/token.
- If refresh fails, redirect to login. With HttpOnly cookies this can be done via a server refresh route.

### Error handling strategy (frontend)
- Always check HTTP status and `body.error`.
- Show user-friendly messages, handle validation errors (400/422).
- Retry idempotent GET requests; avoid automatic retry for POST/PUT without idempotency.

### Best practices
- Prefer HttpOnly cookies for session tokens to mitigate XSS.
- Use in-memory token or secure storage only if cookies are not available.
- Apply optimistic updates for better UX; roll back on server errors.
- Centralize API calls in a small client (api.js) for consistent headers, error handling, and refresh logic.
