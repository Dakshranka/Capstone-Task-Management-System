# TaskFlow - Full Stack Task Management System

A full stack Task Management System with role-based access control, JWT authentication, MySQL persistence, Dockerized services, and GitHub Actions CI/CD.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.3.5
- Spring Data JPA
- Spring Security
- JWT (jjwt)
- MySQL 8

### Frontend
- React 18 (Vite)
- React Router v6
- Axios
- Bootstrap 5

### DevOps
- Docker + Docker Compose
- GitHub Actions CI/CD
- Docker Hub image publishing

## Project Structure

```text
Capstone_project/
├── capstone-project-backend/
│   ├── src/main/java/com/thedakshranka/capstone/project/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/
│   ├── Dockerfile
│   └── pom.xml
├── capstone-project-frontend/
│   ├── src/components/
│   ├── src/context/
│   ├── src/hooks/
│   ├── src/pages/
│   ├── src/services/
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/ci.yml
├── docker-compose.yml
└── .env
```

## Core Features

## Authentication and Authorization
- User registration:
  - first registered account becomes ADMIN
  - all subsequent registrations become USER
- User login with JWT token
- Role-based access:
  - ADMIN
  - USER

## User Management
- List all users (ADMIN only)
- Get current user profile

## Task Management
- Create task
- Update task
- Delete task (allowed for task creator or ADMIN)
- Assign task to a user
- Track task creator and assignee
- Filter by status and assigned user

## Dashboard and UX
- Role-aware dashboard UI (different look for ADMIN and USER)
- Status filtering
- Assigned-user filtering (admin scope)
- Loading, error, and empty states
- Home page + footer + responsive layout

## Backend Setup (Local)

## Prerequisites
- Java 17
- Maven (or use Maven Wrapper)
- MySQL 8

## 1) Configure MySQL
Create database (optional because app can auto-create):

```sql
CREATE DATABASE taskdb;
```

## 2) Configure backend properties
The backend ignores local runtime config file by default:
- capstone-project-backend/src/main/resources/application.properties is in backend .gitignore

Create or update:
- capstone-project-backend/src/main/resources/application.properties

Example:

```properties
spring.application.name=capstone-project-backend
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/taskdb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

app.jwt.secret=YOUR_LONG_SECURE_JWT_SECRET
app.jwt.expiration-ms=86400000
```

## 3) Run backend

Windows:
```bash
cd capstone-project-backend
mvnw.cmd spring-boot:run
```

Mac/Linux:
```bash
cd capstone-project-backend
./mvnw spring-boot:run
```

Backend base URL:
- http://localhost:8081/api

## Frontend Setup (Local)

## Prerequisites
- Node.js 20+

## Run frontend

```bash
cd capstone-project-frontend
npm install
npm run dev
```

Frontend URL:
- http://localhost:5173

Notes:
- Frontend Axios base URL is configurable with VITE_API_BASE_URL (default: http://localhost:8081/api)
- JWT token is automatically attached via request interceptor

Create a local frontend env file if needed:

```bash
cd capstone-project-frontend
cp .env.example .env.local
```

Example:

```env
VITE_API_BASE_URL=http://localhost:9090/api
```

## API Documentation

Base URL: http://localhost:8081/api

## Auth APIs

### Register
POST /auth/register

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "JWT_TOKEN"
}
```

### Login
POST /auth/login

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "JWT_TOKEN"
}
```

## User APIs

### Get all users (ADMIN only)
GET /users

### Get current user
GET /users/me

### Get user by id
GET /users/{id}

## Task APIs

### Create task
POST /tasks

Request:
```json
{
  "title": "Implement API",
  "description": "Create task endpoints",
  "status": "TODO",
  "assignedToId": 2
}
```

### Get tasks (with optional filters)
GET /tasks?status=TODO&assignedTo=2

Query params:
- status: TODO | IN_PROGRESS | DONE
- assignedTo: user id

### Get task by id
GET /tasks/{id}

### Update task
PUT /tasks/{id}

### Delete task
DELETE /tasks/{id}

Authorization rule for delete:
- ADMIN can delete any task
- USER can delete only tasks they created

## Error Format

Validation and API errors are returned in structured JSON with fields such as:
- timestamp
- status
- error
- message
- validationErrors (for validation failures)

## Docker Setup

## Prerequisites
- Docker Desktop

## Environment file
Root .env is used by Docker Compose.

Current variables:
```env
MYSQL_ROOT_PASSWORD=...
MYSQL_DATABASE=taskdb
MYSQL_HOST_PORT=3307
BACKEND_HOST_PORT=8081
VITE_API_BASE_URL=http://localhost:8081/api
```

If backend host port is changed, update both:
- BACKEND_HOST_PORT (host mapping for backend container)
- VITE_API_BASE_URL (frontend API target)

## Run with Docker Compose

```bash
docker compose up --build
```

Services:
- db: MySQL 8 (container 3306, host mapped to MYSQL_HOST_PORT default 3307)
- backend: Spring Boot on container port 8081, host mapped to BACKEND_HOST_PORT
- frontend: Vite preview on 5173

Stop:
```bash
docker compose down
```

Stop and remove DB volume:
```bash
docker compose down -v
```

## CI/CD (GitHub Actions)

Workflow file:
- .github/workflows/ci.yml

Pipeline on push and pull request to main:
1. Checkout
2. Start MySQL service
3. Build and verify backend (Maven)
4. Build frontend (npm ci + npm run build)
5. Build Docker images
6. On push to main: login to Docker Hub and push images

## Required GitHub Secrets
- MYSQL_ROOT_PASSWORD
- APP_JWT_SECRET
- APP_JWT_EXPIRATION_MS
- DOCKERHUB_USERNAME
- DOCKERHUB_PASSWORD

## Docker Image Names
- <DOCKERHUB_USERNAME>/capstone-backend:latest
- <DOCKERHUB_USERNAME>/capstone-frontend:latest

## Run Project Using Docker (No Source Code Required)

### Step 1: Pull Images(Optional)

```bash
docker pull <DOCKERHUB_USERNAME>/capstone-backend:latest
docker pull <DOCKERHUB_USERNAME>/capstone-frontend:latest
```

### Step 2: Create Network

```bash
docker network create capstone-net
```

### Step 3: Run MySQL

```bash
docker run -d --name taskdb-mysql --network capstone-net -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=taskdb -p 3307:3306 mysql:8.0
```

### Step 4: Run Backend

```bash
docker run -d --name task-backend --network capstone-net -e SPRING_DATASOURCE_URL=jdbc:mysql://taskdb-mysql:3306/taskdb -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root -e SERVER_PORT=8081 -e app.jwt.secret=mysecretkeymysecretkeymysecretkey12 -e app.jwt.expiration-ms=3600000 -e SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect -e SPRING_JPA_HIBERNATE_DDL_AUTO=update -p 8081:8081 <DOCKERHUB_USERNAME>/capstone-backend:latest
```

### Step 5: Run Frontend (Vite)

```bash
docker run -d --name task-frontend --network capstone-net -p 5173:5173 <DOCKERHUB_USERNAME>/capstone-frontend:latest
```

###  Access the Application

- Frontend -> http://localhost:5173
- Backend -> http://localhost:8080

###  Important Notes

- Backend runs internally on 8081 but is exposed on 8080.
- Always call backend using: http://localhost:8080
- Do NOT use localhost:8081 in frontend.
- Set frontend environment variable: VITE_API_URL=http://localhost:8080

###  Architecture Flow

GitHub -> GitHub Actions -> Docker Hub -> Local/EC2 -> Browser

- Code pushed to GitHub
- GitHub Actions builds and tests
- Docker images pushed to Docker Hub
- Images pulled on any machine
- Containers run (MySQL + Backend + Frontend)
- Application accessed via browser

## Security Notes
- Do not commit real secrets in source control
- Keep .env out of Git (already ignored at root)
- Keep backend local application.properties out of Git (already ignored in backend)
- Use GitHub Secrets for CI/CD credentials

## Useful Commands

## Backend
```bash
cd capstone-project-backend
mvnw.cmd clean verify
```

## Frontend
```bash
cd capstone-project-frontend
npm run build
```

## Docker
```bash
docker compose config
docker compose up --build
docker compose down
```

## Submission Checklist
- Backend runs on 8081
- Frontend runs on 5173
- JWT login works
- Role-based access works (ADMIN vs USER)
- Task CRUD works
- Docker compose starts all services
- GitHub Actions workflow passes on main

## TaskFlow Dashboard Images

Home page

<img width="1773" height="893" alt="image" src="https://github.com/user-attachments/assets/f4246175-0e02-498d-8eda-816215d35fd3" />

Login page 

<img width="775" height="553" alt="image" src="https://github.com/user-attachments/assets/1d365418-163a-489e-b4ae-63a83f7477a5" />

Admin Dashboard

<img width="1213" height="865" alt="image" src="https://github.com/user-attachments/assets/04f11711-955b-4247-8933-1d98f90dbbe9" />

User Dashboard

<img width="1191" height="676" alt="image" src="https://github.com/user-attachments/assets/1121198c-81af-456c-98f9-f08818842d5e" />

Manage users By Admin

<img width="1091" height="510" alt="image" src="https://github.com/user-attachments/assets/8af818dd-b26b-4ec3-8ce1-1436015d2ae7" />

Create task 

<img width="798" height="420" alt="image" src="https://github.com/user-attachments/assets/a046f919-7d16-4d2a-9f3b-4467f967175c" />


Edit Task to update progress

<img width="730" height="430" alt="image" src="https://github.com/user-attachments/assets/58dc9a48-7a19-42ec-9e53-1ada7fe1fccf" />







