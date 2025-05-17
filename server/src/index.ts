import { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { AppDataSource } from './data-source';
import { registerRoutes } from './routes';
import requestExtensionsPlugin from './plugins/requestExtensions';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Auth0User } from './types/auth0';

// Create fastify server
const buildServer = (options: FastifyServerOptions = {}) => {
  const server: FastifyInstance = fastify(options);
  
  // Register the request extensions plugin
  server.register(requestExtensionsPlugin);
  
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
          // Add type assertion to convert the decoded token to Auth0User
          resolve(decoded as Auth0User);
        }
      );
    });
  });
  
  // Register routes
  registerRoutes(server);
  
  return server;
};

const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');
    
    // Build and start the server
    const server = buildServer({
      logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
      }
    });
    
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    const address = await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();
