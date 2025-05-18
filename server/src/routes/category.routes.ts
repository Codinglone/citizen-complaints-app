import { FastifyInstance } from 'fastify';
import { getAllCategoriesOpts } from '../schemas/category.schema';
import { ApiRoutes } from '../utility/enums';

export function registerCategoryRoutes(server: FastifyInstance) {
  // Get categories
  server.get(ApiRoutes.GET_CATEGORIES, getAllCategoriesOpts);
}