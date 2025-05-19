import { FastifyInstance, FastifyRequest } from 'fastify';
import { Type } from '@sinclair/typebox';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { UserRoles } from '../utility/enums';
import { AIService } from '../services/ai.service';
import { CategoryModel } from '../model/category.model';
import { AgencyModel } from '../model/agency.model';

export function registerAdminRoutes(server: FastifyInstance) {
  // AI routing test endpoint
  server.post<{
    Body: {
      title: string;
      description: string;
      location: string;
      categoryId?: string;
    }
  }>('/api/admin/test-ai-routing', {
    preHandler: [requireAuth, requireRole([UserRoles.ADMIN])],
    schema: {
      tags: ['Admin', 'AI'],
      summary: 'Test AI routing',
      description: 'Test the AI routing system with sample complaint data',
      body: Type.Object({
        title: Type.String(),
        description: Type.String(),
        location: Type.String(),
        categoryId: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          suggestedCategoryId: Type.Optional(Type.String()),
          suggestedCategory: Type.Optional(Type.String()),
          suggestedAgencyId: Type.Optional(Type.String()),
          suggestedAgency: Type.Optional(Type.String()),
          confidence: Type.Number(),
          sentimentScore: Type.Number(),
          language: Type.String()
        }),
        500: Type.Object({
          error: Type.String()
        })
      }
    },
    handler: async (request, reply) => {
      try {
        const { title, description, location } = request.body;
        
        request.log.info('AI routing test request:', { title, description, location });
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AI analysis timed out')), 30000); // Increase timeout
        });
        
        // Race the AI analysis against the timeout
        const aiAnalysisPromise = AIService.analyzeComplaint(title, description, location);
        const aiAnalysis = await Promise.race([aiAnalysisPromise, timeoutPromise]) as any;
        
        request.log.info('AI analysis completed:', aiAnalysis);
        
        // Get category and agency names
        let suggestedCategory = null;
        let suggestedAgency = null;
        
        if (aiAnalysis.suggestedCategoryId) {
          try {
            const category = await CategoryModel.findById(aiAnalysis.suggestedCategoryId);
            suggestedCategory = category?.name;
            request.log.info('Found category:', category);
          } catch (catError) {
            request.log.error('Error finding category:', catError);
          }
        }
        
        if (aiAnalysis.suggestedAgencyId) {
          try {
            const agency = await AgencyModel.findById(aiAnalysis.suggestedAgencyId);
            suggestedAgency = agency?.name || 'Unnamed Agency'; // Provide default name if empty
            request.log.info('Found agency:', agency);
          } catch (agencyError) {
            request.log.error('Error finding agency:', agencyError);
            suggestedAgency = 'Agency Not Found'; // Add error message
          }
        }
        
        const result = {
          suggestedCategoryId: aiAnalysis.suggestedCategoryId,
          suggestedCategory,
          suggestedAgencyId: aiAnalysis.suggestedAgencyId,
          suggestedAgency,
          confidence: aiAnalysis.confidence,
          sentimentScore: aiAnalysis.sentimentScore,
          language: aiAnalysis.language
        };
        
        request.log.info('Sending response to client:', result);
        
        return result;
      } catch (error) {
        request.log.error('AI routing test error:', error);
        return reply.code(500).send({ 
          error: `Failed to test AI routing: ${error.message || 'Unknown error'}`
        });
      }
    }
  });
}