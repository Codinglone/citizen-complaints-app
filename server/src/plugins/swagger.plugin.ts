import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export async function registerSwaggerPlugin(server: FastifyInstance) {
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Citizen Complaints API',
        description: 'API for managing citizen complaints and suggestions',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        }
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token'
          }
        }
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Complaints', description: 'Complaint management endpoints' },
        { name: 'Categories', description: 'Category endpoints' },
        { name: 'Agencies', description: 'Agency endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Admin', description: 'Admin endpoints' }
      ]
    }
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
      displayRequestDuration: true,
      filter: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });
}