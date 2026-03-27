# Capstone Frontend

React + Vite frontend for the TaskFlow project.

## API Base URL Configuration

The frontend reads backend API URL from:

- `VITE_API_BASE_URL`

If not provided, it falls back to:

- `http://localhost:8081/api`

### Local development

Create `.env.local` from example:

```bash
cp .env.example .env.local
```

Set the API URL:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

If your backend runs on another host port, update this value accordingly (for example `9090`).

### Docker build

The Dockerfile accepts build arg `VITE_API_BASE_URL` and bakes it into the frontend build.
In root `docker-compose.yml`, this value is passed from `.env`.
