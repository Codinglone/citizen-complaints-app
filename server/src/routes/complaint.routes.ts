import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { requireAuth, verifyToken } from '../middleware/auth.middleware';
import { AppDataSource } from '../data-source';
import { Complaint } from '../entities/Complaint';
import { Category } from '../entities/Category';

// Define the request body types
interface CreateComplaintRequest {
  title: string;
  description: string;
  categoryId: string;
  location: string;
}

interface AnonymousComplaintRequest extends CreateComplaintRequest {
  contactEmail?: string;
  contactPhone?: string;
}

export function registerComplaintRoutes(server: FastifyInstance) {
  // Get categories
  server.get('/api/categories', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          name: Type.String(),
          description: Type.Union([Type.String(), Type.Null()])
        }))
      }
    },
    handler: async (request, reply) => {
      const categoryRepository = AppDataSource.getRepository(Category);
      const categories = await categoryRepository.find();
      
      return categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
      }));
    }
  });
  
  // Create complaint (authenticated)
  server.post<{ Body: CreateComplaintRequest }>('/api/complaints', {
    schema: {
      body: Type.Object({
        title: Type.String(),
        description: Type.String(),
        categoryId: Type.String(),
        location: Type.String()
      }),
      response: {
        201: Type.Object({
          id: Type.String(),
          message: Type.String()
        })
      }
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      const complaintRepository = AppDataSource.getRepository(Complaint);
      const categoryRepository = AppDataSource.getRepository(Category);
      
      const { title, description, categoryId, location } = request.body;
      
      // Get category
      const category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return reply.code(400).send({ error: 'Invalid category' });
      }
      
      // Create complaint
      const complaint = new Complaint();
      complaint.title = title;
      complaint.description = description;
      complaint.status = 'pending';
      complaint.category = category;
      complaint.user = request.dbUser;
      
      // Save complaint
      const savedComplaint = await complaintRepository.save(complaint);
      
      return reply.code(201).send({
        id: savedComplaint.id,
        message: 'Complaint submitted successfully'
      });
    }
  });
  
  // Create anonymous complaint (no auth required)
  server.post<{ Body: AnonymousComplaintRequest }>('/api/complaints/anonymous', {
    schema: {
      body: Type.Object({
        title: Type.String(),
        description: Type.String(),
        categoryId: Type.String(),
        location: Type.String(),
        contactEmail: Type.Optional(Type.String({ format: 'email' })),
        contactPhone: Type.Optional(Type.String())
      }),
      response: {
        201: Type.Object({
          id: Type.String(),
          message: Type.String(),
          trackingCode: Type.String()
        })
      }
    },
    handler: async (request, reply) => {
      const complaintRepository = AppDataSource.getRepository(Complaint);
      const categoryRepository = AppDataSource.getRepository(Category);
      
      const { title, description, categoryId, location } = request.body;
      
      // Get category
      const category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return reply.code(400).send({ error: 'Invalid category' });
      }
      
      // Create complaint
      const complaint = new Complaint();
      complaint.title = title;
      complaint.description = description;
      complaint.status = 'pending';
      complaint.category = category;
      // No user for anonymous complaints
      
      // Save complaint
      const savedComplaint = await complaintRepository.save(complaint);
      
      // Generate tracking code
      const trackingCode = `ANON-${savedComplaint.id.substring(0, 8).toUpperCase()}`;
      
      return reply.code(201).send({
        id: savedComplaint.id,
        message: 'Anonymous complaint submitted successfully',
        trackingCode
      });
    }
  });
  
  // Get user complaints (authenticated)
  server.get('/api/complaints', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          status: Type.String(),
          categoryName: Type.String(),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        }))
      }
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      const complaintRepository = AppDataSource.getRepository(Complaint);
      
      // Get all complaints for the authenticated user
      const complaints = await complaintRepository.find({
        where: { user: { id: request.dbUser.id } },
        relations: ['category']
      });
      
      return complaints.map(complaint => ({
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        categoryName: complaint.category.name,
        createdAt: complaint.createdAt.toISOString(),
        updatedAt: complaint.updatedAt.toISOString()
      }));
    }
  });
  
  // Get complaint by ID (authenticated)
  server.get<{ Params: { id: string } }>('/api/complaints/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          status: Type.String(),
          category: Type.Object({
            id: Type.String(),
            name: Type.String()
          }),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      const complaintRepository = AppDataSource.getRepository(Complaint);
      const { id } = request.params;
      
      // Get complaint with category
      const complaint = await complaintRepository.findOne({
        where: { id, user: { id: request.dbUser.id } },
        relations: ['category']
      });
      
      if (!complaint) {
        return reply.code(404).send({ error: 'Complaint not found' });
      }
      
      return {
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        category: {
          id: complaint.category.id,
          name: complaint.category.name
        },
        createdAt: complaint.createdAt.toISOString(),
        updatedAt: complaint.updatedAt.toISOString()
      };
    }
  });
}