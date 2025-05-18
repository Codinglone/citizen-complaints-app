import { Type } from '@sinclair/typebox';
import { getAllCategoriesController } from '../controllers/category.controller';

export const getAllCategoriesOpts = {
  schema: {
    tags: ['Categories'],
    summary: 'Get all categories',
    description: 'Get all available complaint categories',
    response: {
      200: Type.Array(Type.Object({
        id: Type.String({ description: 'Category ID' }),
        name: Type.String({ description: 'Category name' }),
        description: Type.Union([
          Type.String({ description: 'Category description' }), 
          Type.Null()
        ])
      })),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    }
  },
  handler: getAllCategoriesController
};