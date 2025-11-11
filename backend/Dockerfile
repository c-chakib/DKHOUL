# Dockerfile location: /your-monorepo/backend/Dockerfile

## -------- Builder stage --------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .  # Now this copies from backend directory
RUN npm run build

## -------- Runtime stage --------
FROM node:18-alpine AS runtime
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]