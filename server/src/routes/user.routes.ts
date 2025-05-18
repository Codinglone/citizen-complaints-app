import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { requireAdmin, requireAuth, requireRole } from '../middleware/auth.middleware';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export function registerUserRoutes(server: FastifyInstance) {
  // Health check
  server.get('/api/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
  
  // Get all users (admin only)
  server.get('/api/users', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          fullName: Type.String(),
          email: Type.String(),
          role: Type.String(),
          profileImage: Type.Union([Type.String(), Type.Null()]),
          createdAt: Type.String({ format: 'date-time' })
        }))
      }
    },
    preHandler: requireAdmin,
    handler: async (request, reply) => {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();
      
      return users.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt.toISOString()
      }));
    }
  });
  
  // Update user role (admin only)
  server.patch('/api/users/:id/role', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Object({
        role: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String()
        })
      }
    },
    preHandler: requireAdmin,
    handler: async (request, reply) => {
      const userRepository = AppDataSource.getRepository(User);
      const { id } = request.params as { id: string };
      const { role } = request.body as { role: string };
      
      // Validate role
      const validRoles = ['admin', 'department_manager', 'department_staff', 'citizen'];
      if (!validRoles.includes(role)) {
        return reply.code(400).send({ error: 'Invalid role' });
      }
      
      // Find user
      const user = await userRepository.findOne({ where: { id } });
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      // Update role
      user.role = role;
      await userRepository.save(user);
      
      return {
        success: true,
        message: `User role updated to ${role}`
      };
    }
  });
  
  // Delete user (admin only)
  server.delete('/api/users/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String()
        })
      }
    },
    preHandler: requireAdmin,
    handler: async (request, reply) => {
      const userRepository = AppDataSource.getRepository(User);
      const { id } = request.params as { id: string };
      
      // Find user
      const user = await userRepository.findOne({ where: { id } });
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      // Admin cannot delete themselves
      if (user.id === request.dbUser.id) {
        return reply.code(400).send({ error: 'Cannot delete your own account' });
      }
      
      // Delete user
      await userRepository.remove(user);
      
      return {
        success: true,
        message: 'User deleted successfully'
      };
    }
  });
}