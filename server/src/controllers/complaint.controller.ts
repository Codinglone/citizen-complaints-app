import { FastifyRequest, FastifyReply } from 'fastify';
import { ComplaintModel } from '../model/complaint.model';
import { ComplaintStatus, ComplaintPriority } from '../utility/enums';
import { AIService } from '../services/ai.service';
import { CategoryModel } from '../model/category.model';
import { AgencyModel } from '../model/agency.model';
import { logger } from '../utility/logger';

// Define request interfaces for proper typing
interface CreateComplaintRequest {
  Body: {
    title: string;
    description: string;
    categoryId: string;
    location: string;
  }
}

interface AnonymousComplaintRequest {
  Body: {
    title: string;
    description: string;
    categoryId: string;
    location: string;
    contactEmail?: string;
    contactPhone?: string;
  }
}

interface ComplaintIdParam {
  Params: {
    id: string;
  }
}

interface UpdateComplaintRequest {
  Params: {
    id: string;
  },
  Body: {
    status?: ComplaintStatus;
    agencyId?: string;
    priority?: ComplaintPriority;
  }
}

export async function createComplaintController(
  request: FastifyRequest<CreateComplaintRequest>,
  reply: FastifyReply
) {
  try {
    const result = await ComplaintModel.createComplaint({
      title: request.body.title,
      description: request.body.description,
      categoryId: request.body.categoryId,
      location: request.body.location,
      user: request.dbUser!
    });
    
    return reply.code(201).send({
      id: result.id,
      trackingCode: result.trackingCode,
      message: 'Complaint submitted successfully'
    });
  } catch (error) {
    request.log.error(error);
    if (error.message === 'Invalid category') {
      return reply.code(400).send({ error: 'Invalid category' });
    }
    return reply.code(500).send({ error: 'Failed to create complaint' });
  }
}

// Modify the createAnonymousComplaintController function
export async function createAnonymousComplaintController(
  request: FastifyRequest<AnonymousComplaintRequest>,
  reply: FastifyReply
) {
  try {
    const { title, description, categoryId, location, contactEmail, contactPhone } = request.body;

    // Validate if the category exists
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return reply.code(400).send({ error: 'Invalid category' });
    }

    // Use AI to analyze the complaint if enabled
    let aiAnalysis = null;
    try {
      aiAnalysis = await AIService.analyzeComplaint(title, description, location);
      
      logger.info('AI Analysis result:', {
        suggestedCategoryId: aiAnalysis.suggestedCategoryId,
        suggestedAgencyId: aiAnalysis.suggestedAgencyId,
        confidence: aiAnalysis.confidence
      });
    } catch (aiError) {
      logger.error('AI analysis failed:', aiError);
    }

    // Create the complaint with AI-suggested values when available
    const complaintData = {
      title,
      description,
      categoryId: categoryId, // Use user-selected category as primary
      location,
      contactEmail,
      contactPhone,
      // Add AI-derived fields
      sentimentScore: aiAnalysis?.sentimentScore ?? 0,
      language: aiAnalysis?.language ?? 'en',
      // If AI confidence is high (over 80%), use suggested agency
      agencyId: aiAnalysis?.confidence > 80 ? aiAnalysis.suggestedAgencyId : null
    };

    // Create the complaint
    const result = await ComplaintModel.createAnonymousComplaint(complaintData);

    return reply.code(201).send({
      id: result.id,
      trackingCode: result.trackingCode,
      message: 'Anonymous complaint submitted successfully',
      // Include AI suggestions in response
      aiSuggestions: aiAnalysis ? {
        suggestedCategoryId: aiAnalysis.suggestedCategoryId,
        suggestedCategory: aiAnalysis.suggestedCategoryId ? 
          (await CategoryModel.findById(aiAnalysis.suggestedCategoryId))?.name : null,
        suggestedAgencyId: aiAnalysis.suggestedAgencyId,
        suggestedAgency: aiAnalysis.suggestedAgencyId ? 
          (await AgencyModel.findById(aiAnalysis.suggestedAgencyId))?.name : null,
        confidence: aiAnalysis.confidence
      } : null
    });
  } catch (error) {
    request.log.error(error);
    if (error.message === 'Invalid category') {
      return reply.code(400).send({ error: 'Invalid category' });
    }
    return reply.code(500).send({ error: 'Failed to create anonymous complaint' });
  }
}

export async function trackComplaintController(
  request: FastifyRequest<{ Params: { trackingCode: string } }>,
  reply: FastifyReply
) {
  try {
    const { trackingCode } = request.params;
    
    // Get complaint with simplified query to avoid schema issues
    const complaint = await ComplaintModel.getComplaintByTrackingCode(trackingCode);
    
    // Transform the data to match the expected response schema
    const response = {
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      status: complaint.status,
      priority: complaint.priority,
      trackingCode: complaint.trackingCode,
      categoryName: complaint.category?.name || 'Uncategorized', // Add this field to match schema
      categoryId: complaint.category?.id,
      agencyName: complaint.agency?.name,
      agencyId: complaint.agency?.id,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    };
    
    return reply.code(200).send(response);
  } catch (error) {
    request.log.error(error);
    if (error.message === 'Complaint not found') {
      return reply.code(404).send({ error: 'Complaint not found' });
    }
    return reply.code(500).send({ error: 'Failed to track complaint' });
  }
}

export async function getUserComplaintsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Using non-null assertion since we know dbUser exists due to auth middleware
    return await ComplaintModel.getUserComplaints(request.dbUser!.id);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Failed to fetch complaints' });
  }
}

export async function getComplaintByIdController(
  request: FastifyRequest<ComplaintIdParam>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    return await ComplaintModel.getComplaintById(id, request.dbUser!.id);
  } catch (error) {
    request.log.error(error);
    if (error.message === 'Complaint not found') {
      return reply.code(404).send({ error: 'Complaint not found' });
    }
    return reply.code(500).send({ error: 'Failed to fetch complaint' });
  }
}

export async function getAllComplaintsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    return await ComplaintModel.getAllComplaints();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Failed to fetch all complaints' });
  }
}

export async function updateComplaintController(
  request: FastifyRequest<UpdateComplaintRequest>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const complaintId = await ComplaintModel.updateComplaint({
      id,
      status: request.body.status,
      priority: request.body.priority,
      agencyId: request.body.agencyId
    });
    
    return {
      id: complaintId,
      message: 'Complaint updated successfully'
    };
  } catch (error) {
    request.log.error(error);
    if (error.message === 'Complaint not found') {
      return reply.code(404).send({ error: 'Complaint not found' });
    }
    if (error.message === 'Invalid agency') {
      return reply.code(400).send({ error: 'Invalid agency' });
    }
    return reply.code(500).send({ error: 'Failed to update complaint' });
  }
}