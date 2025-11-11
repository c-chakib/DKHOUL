
## -------- Builder stage --------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . ./
RUN npm run build
RUN npm run build
RUN npm ci

# Copy backend source and build
COPY backend/ ./
RUN npm run build
RUN npm ci

# Copy source and build
COPY . .  
RUN npm run build

## -------- Runtime stage --------
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled artifacts
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production

# Copy compiled artifacts
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]