import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { verifyToken, requireAuth } from '../middleware/auth.middleware';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Auth0User } from '../types/auth0';

// Define the update profile request type
interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
}

export function registerAuthRoutes(server: FastifyInstance) {
  // Verify token endpoint
  server.get('/api/auth/verify', {
    handler: async (request, reply) => {
      try {
        await verifyToken(request, reply);
        return { isValid: true, user: request.user };
      } catch (error) {
        return { isValid: false };
      }
    }
  });
  
  // Get user profile
  server.get('/api/profile', {
    schema: {
      response: {
        200: Type.Object({
          id: Type.String(),
          fullName: Type.String(),
          email: Type.String(),
          role: Type.String(),
          profileImage: Type.Union([Type.String(), Type.Null()]),
          city: Type.Union([Type.String(), Type.Null()]),
          phoneNumber: Type.String()
        })
      }
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      if (!request.dbUser) {
        return reply.code(404).send({ error: 'User profile not found' });
      }
      
      return {
        id: request.dbUser.id,
        fullName: request.dbUser.fullName,
        email: request.dbUser.email,
        role: request.dbUser.role,
        profileImage: request.dbUser.profileImage,
        city: request.dbUser.city,
        phoneNumber: request.dbUser.phoneNumber
      };
    }
  });
  
  // Update user profile
  server.patch<{ Body: UpdateProfileRequest }>('/api/profile', {
    schema: {
      body: Type.Object({
        fullName: Type.Optional(Type.String()),
        phoneNumber: Type.Optional(Type.String()),
        city: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          user: Type.Object({
            id: Type.String(),
            fullName: Type.String(),
            email: Type.String(),
            role: Type.String(),
            profileImage: Type.Union([Type.String(), Type.Null()]),
            city: Type.Union([Type.String(), Type.Null()]),
            phoneNumber: Type.String()
          })
        })
      }
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      if (!request.dbUser) {
        return reply.code(404).send({ error: 'User profile not found' });
      }
      
      const userRepository = AppDataSource.getRepository(User);
      const updateData = request.body;
      
      // Update user fields
      if (updateData.fullName) request.dbUser.fullName = updateData.fullName;
      if (updateData.phoneNumber) request.dbUser.phoneNumber = updateData.phoneNumber;
      if (updateData.city) request.dbUser.city = updateData.city;
      
      // Save updated user
      const updatedUser = await userRepository.save(request.dbUser);
      
      return {
        success: true,
        user: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
          city: updatedUser.city,
          phoneNumber: updatedUser.phoneNumber
        }
      };
    }
  });
}