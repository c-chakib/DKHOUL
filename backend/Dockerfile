## -------- Builder stage: install dev deps and compile TypeScript --------
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev) to build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

## -------- Runtime stage: production-only image --------
FROM node:18-alpine AS runtime
WORKDIR /app

# Install only production dependencies - COPY BOTH FILES EXPLICITLY
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy compiled artifacts from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]