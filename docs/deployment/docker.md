# Docker Deployment Guide

This guide covers deploying DKHOUL using Docker and Docker Compose.

## 🐳 Docker Architecture

The application uses a multi-container setup:

- **MongoDB**: Database service
- **Redis**: Caching and session storage
- **Backend**: Node.js API server
- **Frontend**: Angular SPA served by Nginx

## 🚀 Quick Deployment

### Using Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dkhoul
   ```

2. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with production values
   ```

3. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Check service status**
   ```bash
   docker-compose ps
   ```

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

## 📝 Environment Configuration

### Backend Environment Variables

Create `backend/.env` with:

```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/dkhoul?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# External Services
CLIENT_URL=https://yourdomain.com
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG.YourApiKey
```

### Docker Compose Override

For production overrides, create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:prod-password@mongodb:27017/dkhoul?authSource=admin
    secrets:
      - jwt_secret
      - aws_credentials

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  aws_credentials:
    file: ./secrets/aws_credentials.json
```

## 🔧 Docker Commands

### Container Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up -d --build backend

# View logs
docker-compose logs backend

# Execute commands in container
docker-compose exec backend sh
```

### Database Operations

```bash
# Backup database
docker-compose exec mongodb mongodump --db dkhoul --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup/dkhoul

# Access MongoDB shell
docker-compose exec mongodb mongo -u admin -p password123 dkhoul
```

## 📊 Monitoring

### Health Checks

The backend includes health check endpoints:

```bash
# Check backend health
curl http://localhost:5000/api/v1/health

# Check database connectivity
curl http://localhost:5000/api/v1/health/db
```

### Resource Monitoring

```bash
# View container resource usage
docker stats

# Check disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## 🔒 Security Considerations

### Secrets Management

- Use Docker secrets for sensitive data
- Never commit secrets to version control
- Rotate secrets regularly

### Network Security

```yaml
# docker-compose.yml
services:
  backend:
    networks:
      - internal
      - external

networks:
  internal:
    internal: true
  external:
    driver: bridge
```

### SSL/TLS

For HTTPS, use a reverse proxy like Nginx or Traefik:

```yaml
# Add to docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
```

## 🚀 Production Optimizations

### Multi-stage Builds

The Dockerfiles use multi-stage builds for smaller images:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Performance Tuning

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 🔄 Updates and Rollbacks

### Rolling Updates

```bash
# Update specific service
docker-compose up -d backend

# Check update status
docker-compose ps

# Rollback if needed
docker-compose up -d --no-deps backend
```

### Blue-Green Deployment

```bash
# Create blue environment
docker-compose -f docker-compose.blue.yml up -d

# Switch traffic (using load balancer)
# ...

# Remove old environment
docker-compose -f docker-compose.green.yml down
```

## 🆘 Troubleshooting

### Common Issues

**Container fails to start**
```bash
docker-compose logs <service-name>
```

**Database connection issues**
```bash
docker-compose exec backend npm run migrate
```

**Out of disk space**
```bash
docker system prune -a --volumes
```

**Port conflicts**
```bash
docker-compose ps
# Change ports in docker-compose.yml
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)