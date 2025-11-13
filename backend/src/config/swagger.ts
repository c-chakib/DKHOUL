import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DKHOUL API',
      version: '1.0.0',
      description: 'DKHOUL Marketplace API Documentation - Connecting tourists with local service providers in Morocco',
      contact: {
        name: 'DKHOUL Support',
        email: 'support@dkhoul.ma'
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.dkhoul.ma'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['tourist', 'host', 'admin'] },
            profilePicture: { type: 'string' },
            phone: { type: 'string' },
            location: { type: 'string' },
            bio: { type: 'string' },
            languages: { type: 'array', items: { type: 'string' } },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            hostId: { type: 'string' },
            pricing: {
              type: 'object',
              properties: {
                amount: { type: 'number' },
                currency: { type: 'string', default: 'MAD' },
                type: { type: 'string', enum: ['fixed', 'hourly', 'daily'] }
              }
            },
            location: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                city: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number' },
                    lng: { type: 'number' }
                  }
                }
              }
            },
            images: { type: 'array', items: { type: 'string' } },
            availability: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['active', 'inactive', 'pending'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
    }
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};