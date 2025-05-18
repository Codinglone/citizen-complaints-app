import { FastifyInstance } from 'fastify';
import { getAnalytics } from '../controllers/analytics.controller';
import { Type } from '@sinclair/typebox';

export const analyticsRoutes = async (fastify: FastifyInstance) => {
  // Get analytics data
  fastify.get('/analytics', {
    schema: {
      tags: ['Analytics'],
      summary: 'Get analytics data',
      description: 'Get analytics data for the dashboard',
      querystring: Type.Object({
        timeRange: Type.Union([
          Type.Literal('week'),
          Type.Literal('month'),
          Type.Literal('quarter'),
          Type.Literal('year')
        ], {
          description: 'Time range for analytics data'
        })
      }),
      response: {
        200: Type.Object({
          totalComplaints: Type.Number(),
          resolvedComplaints: Type.Number(),
          averageResolutionTime: Type.Number(),
          satisfactionRate: Type.Number(),
          categoryDistribution: Type.Array(
            Type.Object({
              name: Type.String(),
              value: Type.Number()
            })
          ),
          timeSeriesData: Type.Array(
            Type.Object({
              date: Type.String(),
              complaints: Type.Number(),
              resolved: Type.Number()
            })
          ),
          topAgencies: Type.Array(
            Type.Object({
              name: Type.String(),
              complaintsHandled: Type.Number(),
              resolutionRate: Type.Number(),
              avgResolutionTime: Type.Number()
            })
          )
        }),
        500: Type.Object({
          error: Type.String()
        })
      },
      security: [{ bearerAuth: [] }]
    },
    handler: getAnalytics
  });
}; 