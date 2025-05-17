import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Auth0User } from '../types/auth0';
import * as jwt from 'jsonwebtoken';

// Verify JWT token
export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401).send({ error: 'Unauthorized - No token provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // First, try to verify as a regular JWT token
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your-secret-key-for-signing-tokens'
        ) as { id: string, email: string, role: string };
        
        // If we get here, it's a valid JWT token
        // Load the user from database
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Set request.dbUser directly
        request.dbUser = user;
        
      } catch (jwtError) {
        // If not a valid JWT token, try Auth0
        const decoded = await request.server.verifyAuth0Token(token) as Auth0User;
        
        // Add Auth0 user info to request
        request.user = decoded;
      }
    } catch (verifyError) {
      request.log.error(verifyError);
      reply.code(401).send({ error: 'Unauthorized - Invalid token' });
    }
    
  } catch (error) {
    request.log.error(error);
    reply.code(401).send({ error: 'Unauthorized - Invalid token' });
  }
}

// Middleware to ensure a valid token exists and attach user from DB
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await verifyToken(request, reply);
    
    // If dbUser is already set by the JWT verification, we're good
    if (request.dbUser) {
      return;
    }
    
    // If we get here and don't have an Auth0 user, unauthorized
    if (!request.user) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    
    // Lookup user in database
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ 
      where: [
        { auth0Id: request.user.sub },
        { email: request.user.email }
      ].filter(Boolean) // Filter out undefined conditions if email is missing
    });
    
    // If it's a first-time login, create the user
    if (!user && request.user.email) {
      const newUser = new User();
      newUser.email = request.user.email;
      newUser.fullName = request.user.name || request.user.email.split('@')[0];
      newUser.auth0Id = request.user.sub;
      newUser.password = ''; // Auth0 handles auth
      newUser.phoneNumber = '';
      newUser.profileImage = request.user.picture || null;
      newUser.role = 'citizen'; // Default role
      
      user = await userRepository.save(newUser);
    } else if (user && !user.auth0Id) {
      // Update existing user with Auth0 ID
      user.auth0Id = request.user.sub;
      user = await userRepository.save(user);
    }
    
    // Attach database user to request
    if (user) {
      request.dbUser = user;
    }
    
  } catch (error) {
    request.log.error(error);
    reply.code(401).send({ error: 'Authentication failed' });
  }
}

// Check if user has admin role
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  await requireAuth(request, reply);
  
  if (!request.dbUser || request.dbUser.role !== 'admin') {
    reply.code(403).send({ error: 'Forbidden - Admin access required' });
  }
}

// Check if user has specific role(s)
export function requireRole(roles: string[]) {
  return async function(request: FastifyRequest, reply: FastifyReply) {
    await requireAuth(request, reply);
    
    if (!request.dbUser || !roles.includes(request.dbUser.role)) {
      reply.code(403).send({ 
        error: 'Forbidden - Insufficient permissions',
        requiredRoles: roles
      });
    }
  };
}
