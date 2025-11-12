# REST API Documentation

DKHOUL provides a comprehensive REST API for marketplace operations.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All API requests require authentication except for user registration and login.

### JWT Token
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Core Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user profile

### Services
- `GET /services` - List services with filtering
- `POST /services` - Create new service (hosts only)
- `GET /services/:id` - Get service details
- `PUT /services/:id` - Update service (owner only)
- `DELETE /services/:id` - Delete service (owner only)

### Bookings
- `GET /bookings` - List user bookings
- `POST /bookings` - Create new booking
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/cancel` - Cancel booking

### Messages
- `GET /messages/conversations` - List user conversations
- `GET /messages/:conversationId` - Get conversation messages
- `POST /messages` - Send message

### Reviews
- `GET /services/:serviceId/reviews` - Get service reviews
- `POST /reviews` - Create review (after booking completion)

### File Upload
- `POST /upload/image` - Upload single image
- `POST /upload/images` - Upload multiple images

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 100 requests per 15 minutes for most endpoints
- 10 requests per minute for authentication endpoints

## WebSocket Events

Real-time features use Socket.IO:

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});
```

### Events
- `message:new` - New message received
- `booking:updated` - Booking status changed
- `notification:new` - New notification

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## SDKs and Libraries

- **Frontend**: Angular services in `src/app/core/services/`
- **Testing**: API tests in `backend/src/__tests__/`

For detailed endpoint specifications, see the Postman collection or Swagger documentation.