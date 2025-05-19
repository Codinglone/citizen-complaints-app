import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { CategoryModel } from '../model/category.model';

export function registerCategoryRoutes(server: FastifyInstance) {
  // Get all categories
  server.get('/api/categories', {
    schema: {
      tags: ['Categories'],
      summary: 'Get all categories',
      description: 'Retrieves all complaint categories',
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          name: Type.String(),
          description: Type.Optional(Type.String())
        }))
      }
    },
    handler: async (request, reply) => {
      try {
        const categories = await CategoryModel.getAll();
        return categories;
      } catch (error) {
        request.log.error('Failed to fetch categories:', error);
        return reply.code(500).send({ error: 'Failed to fetch categories' });
      }
    }
  });
}