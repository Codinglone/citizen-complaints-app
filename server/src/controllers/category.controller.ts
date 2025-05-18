import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoryModel } from '../model/category.model';

export async function getAllCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    return await CategoryModel.getAllCategories();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Failed to fetch categories' });
  }
}