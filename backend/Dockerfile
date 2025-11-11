## -------- Builder stage: install dev deps and compile TypeScript --------
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev) to build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production dependencies only
RUN npm prune --production

## -------- Runtime stage: production-only image --------
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

EXPOSE 5000
CMD ["npm", "start"]