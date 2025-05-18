import { FastifyRequest, FastifyReply } from 'fastify';
import { ComplaintModel } from '../model/complaint.model';
import { ComplaintStatus, ComplaintPriority } from '../utility/enums';

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

export async function createAnonymousComplaintController(
  request: FastifyRequest<AnonymousComplaintRequest>,
  reply: FastifyReply
) {
  try {
    const result = await ComplaintModel.createAnonymousComplaint({
      title: request.body.title,
      description: request.body.description,
      categoryId: request.body.categoryId,
      location: request.body.location,
      contactEmail: request.body.contactEmail,
      contactPhone: request.body.contactPhone
    });
    
    return reply.code(201).send({
      id: result.id,
      trackingCode: result.trackingCode,
      message: 'Anonymous complaint submitted successfully'
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