import { Type } from '@sinclair/typebox';
import { getAllAgenciesController } from '../controllers/agency.controller';

export const getAllAgenciesOpts = {
  schema: {
    tags: ['Agencies'],
    summary: 'Get all agencies',
    description: 'Get all available agencies/departments',
    response: {
      200: Type.Array(Type.Object({
        id: Type.String({ description: 'Agency ID' }),
        name: Type.String({ description: 'Agency name' }),
        description: Type.Union([
          Type.String({ description: 'Agency description' }), 
          Type.Null()
        ])
      })),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    }
  },
  handler: getAllAgenciesController
};