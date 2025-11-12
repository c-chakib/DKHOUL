# Quick Start Guide

This guide will get you up and running with DKHOUL in minutes.

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** and **Docker Compose** (for full stack)
- **MongoDB** (local or cloud instance)

## 🚀 Fast Setup with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dkhoul
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## 🛠️ Manual Development Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

## 🔧 Environment Configuration

Copy `.env.example` to `.env` in the backend directory and configure:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dkhoul
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:4200
```

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📚 Next Steps

- Read the [MongoDB Setup Guide](mongodb-setup.md) for database configuration
- Check the [API Documentation](../api/rest-api.md) for available endpoints
- Review the [Development Guides](../development/) for coding standards

## 🆘 Troubleshooting

**Port conflicts?**
- Change ports in `docker-compose.yml` or `.env`

**Database connection issues?**
- Ensure MongoDB is running
- Check connection string in `.env`

**Build failures?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`