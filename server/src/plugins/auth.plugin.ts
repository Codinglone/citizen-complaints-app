import { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

// Update this declaration to prevent conflicts
declare module 'fastify' {
  interface FastifyRequest {
    // Using optional modifier to avoid conflicts
    dbUser?: User;
  }
}

// Extend the existing Auth0User type instead of redefining 'user'
declare module '@fastify/jwt' {
  interface FastifyJWT {
    // Only declare the payload property
    payload: {
      id: string;
      email: string;
      role: string;
    };
    // Don't redeclare 'user' here as it's already defined elsewhere
  }
}

export async function registerAuthPlugin(server: FastifyInstance) {
  // Register JWT plugin
  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-for-development',
    sign: {
      expiresIn: '1d' // Token expires in 1 day
    }
  });

  // Add a decorator to verify JWT
  server.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized: Invalid or expired token' });
    }
  });

  // Add hook to load user from database when token is verified
  server.addHook('preHandler', async (request, reply) => {
    // Skip if no authorization header or if path is excluded
    if (!request.headers.authorization || 
        request.routeOptions.url.startsWith('/api-docs') ||
        request.routeOptions.url === '/api/auth/login' ||
        request.routeOptions.url.startsWith('/api/complaints/anonymous') ||
        request.routeOptions.url === '/api/categories' ||
        request.routeOptions.url === '/api/agencies') {
      return;
    }

    try {
      // Verify the token
      await request.jwtVerify();
      
      // Access user ID from the verified token
      // Accessing as any to accommodate both our expected structure 
      // and the Auth0User structure
      const userId = (request.user as any).id;
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid token: missing user ID' });
      }

      // Load user from database
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { id: userId },
        select: ['id', 'email', 'fullName', 'role']
      });

      if (!user) {
        return reply.code(401).send({ error: 'User not found' });
      }

      // Add user to request object
      request.dbUser = user;
      
    } catch (err) {
      // Don't send error here, let the route-specific authenticate handle it
      request.log.error({ err }, 'JWT verification failed');
    }
  });
}