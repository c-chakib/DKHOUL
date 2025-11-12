# Dockerfile location: /your-monorepo/backend/Dockerfile

## -------- Builder stage --------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and lock file from parent directory (monorepo root)
COPY ../package*.json ./
RUN npm ci
RUN npm ci

# Copy source and build
COPY . ./
RUN npm run build

## -------- Runtime stage --------
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy package files and lock file from parent directory (monorepo root)
COPY ../package*.json ./
RUN npm ci --only=production
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]