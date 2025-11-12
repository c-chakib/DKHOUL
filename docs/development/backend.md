# Backend Development Guide

This guide covers backend development practices for the DKHOUL API.

## 🏗️ Architecture

The backend follows a modular architecture:

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server startup
├── config/             # Configuration files
├── controllers/        # Route handlers
├── middleware/         # Express middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── services/          # Business logic
├── socket/            # WebSocket handlers
├── utils/             # Utility functions
└── __tests__/         # Test files
```

## 🛠️ Development Workflow

### Starting Development

```bash
cd backend
npm run dev  # Starts with ts-node-dev and hot reload
```

### Building for Production

```bash
npm run build  # Compiles TypeScript to JavaScript
npm start      # Runs compiled code
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📝 Code Standards

### TypeScript
- Strict type checking enabled
- Use interfaces for data structures
- Avoid `any` type except for external libraries

### Naming Conventions
- **Files**: kebab-case (e.g., `user.model.ts`)
- **Classes**: PascalCase (e.g., `UserController`)
- **Methods**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE

### Error Handling
Use the custom error middleware:

```typescript
import { AppError } from '../middleware/error.middleware';

// In controllers
if (!user) {
  throw new AppError('User not found', 404);
}
```

### Logging
Use Winston logger instead of console.log:

```typescript
import { logger } from '../utils/logger';

// Different log levels
logger.info('User logged in', { userId });
logger.error('Database connection failed', { error });
```

## 🗄️ Database

### Models
- Use Mongoose for MongoDB integration
- Define schemas with validation
- Add indexes for performance
- Use virtuals and methods for computed properties

### Migrations
```bash
npm run migrate  # Run database migrations
```

## 🔐 Authentication & Security

### JWT Tokens
- Access tokens expire in 24 hours
- Refresh tokens for session management
- Passwords hashed with bcryptjs

### Middleware
- `auth.middleware.ts` - JWT verification
- `validation.middleware.ts` - Input validation
- `upload.middleware.ts` - File upload handling

## 📡 API Design

### RESTful Conventions
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Resource-based URLs
- Consistent response format
- Proper status codes

### Validation
Use express-validator for input validation:

```typescript
import { body } from 'express-validator';

export const validateUserRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim()
];
```

## 🧪 Testing

### Unit Tests
- Test business logic in services
- Mock external dependencies
- Use Jest with ts-jest

### Integration Tests
- Test API endpoints
- Use supertest for HTTP testing
- Test database operations

### Test Structure
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      // Test implementation
    });
  });
});
```

## 🚀 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
STRIPE_SECRET_KEY=...
SENDGRID_API_KEY=...
```

## 🔍 Debugging

### VS Code Debug Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/server.ts",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
}
```

### Common Issues
- **Port conflicts**: Change PORT in .env
- **MongoDB connection**: Check connection string
- **CORS issues**: Verify CLIENT_URL in .env

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)