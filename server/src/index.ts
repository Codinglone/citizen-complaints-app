import { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { AppDataSource } from './data-source';
import { registerRoutes } from './routes';
import requestExtensionsPlugin from './plugins/requestExtensions';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Auth0User } from './types/auth0';
import "reflect-metadata";
import { config } from "dotenv";

config();

// Create fastify server
export const buildApp = async (options: FastifyServerOptions = {}) => {
  const server: FastifyInstance = fastify({
    ...options,
    logger: true
  });
  
  // Register the request extensions plugin
  server.register(requestExtensionsPlugin);
  
  // Register Swagger plugins
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
  
  // Initialize JWKS client
  const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  });
  
  // Function to get signing key
  function getKey(header: jwt.JwtHeader, callback: Function) {
    client.getSigningKey(header.kid, function(err: Error | null, key: any) {
      if (err) return callback(err);
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }
  
  // Register JWT plugin with a simple secret for now
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-for-signing-tokens',
    verify: {
      allowedAud: process.env.AUTH0_AUDIENCE,
      allowedIss: `https://${process.env.AUTH0_DOMAIN}/`
    }
  });
  
  // Add custom verifier for Auth0 tokens
  server.decorate('verifyAuth0Token', async function(token: string): Promise<Auth0User> {
    return new Promise<Auth0User>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          audience: process.env.AUTH0_AUDIENCE,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ['RS256']
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded as Auth0User);
        }
      );
    });
  });
  
  // Register routes
  registerRoutes(server);
  
  return server;
};

const PORT = parseInt(process.env.PORT || "3001", 10);
const NODE_ENV = process.env.NODE_ENV || "development";

async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Build the Fastify app
    const server = await buildApp();

    // Configure CORS based on environment
    const allowedOrigins = NODE_ENV === "production" 
      ? [process.env.FRONTEND_URL, process.env.NGROK_URL].filter(Boolean)
      : ["http://localhost:3000"];

    console.log('Allowed origins:', allowedOrigins);

    server.register(require("@fastify/cors"), {
      origin: (origin, cb) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return cb(null, true);
        
        if (allowedOrigins.includes(origin)) {
          cb(null, true);
          return;
        }
        
        // Log rejected origins for debugging
        console.log('Rejected origin:', origin);
        cb(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Content-Type", "Authorization"],
    });

    // Add error handler
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
      reply.status(error.statusCode || 500).send({
        error: {
          message: error.message || 'Internal Server Error',
          code: error.code || 'INTERNAL_SERVER_ERROR'
        }
      });
    });

    // Start listening
    await server.listen({ port: PORT, host: "0.0.0.0" });
    
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    console.log(`Swagger documentation available at http://0.0.0.0:${PORT}/api-docs`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

startServer();
