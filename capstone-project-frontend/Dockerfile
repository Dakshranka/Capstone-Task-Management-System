# Stage 1: Build the Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=http://localhost:8081/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Stage 2: Runtime (serve built app with vite preview)
FROM node:20-alpine AS runner

WORKDIR /app

# Install only vite CLI in runtime image.
RUN npm install -g vite@5.4.10

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
