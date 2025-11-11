## -------- Builder stage: install dev deps and compile TypeScript --------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./
RUN npm ci

# Copy backend source and build
COPY backend/ ./
RUN npm run build

## -------- Runtime stage: production-only image --------
FROM node:18-alpine AS runtime
WORKDIR /app

# Install only production dependencies - COPY FROM BACKEND DIR
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production

# Copy compiled artifacts from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]