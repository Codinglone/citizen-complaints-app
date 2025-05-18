import { FastifyInstance } from 'fastify';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { 
  createComplaintOpts,
  createAnonymousComplaintOpts,
  getUserComplaintsOpts,
  getComplaintByIdOpts,
  getAllComplaintsOpts,
  updateComplaintOpts,
  trackComplaintOpts
} from '../schemas/complaint.schema';
import { ApiRoutes, UserRoles } from '../utility/enums';

export function registerComplaintRoutes(server: FastifyInstance) {

  server.get('/api/complaints/track/:trackingCode', trackComplaintOpts);
  // Create complaint (authenticated)
  server.post(ApiRoutes.CREATE_COMPLAINT, {
    preHandler: requireAuth,
    ...createComplaintOpts
  });
  
  // Create anonymous complaint (no auth required)
  server.post(ApiRoutes.CREATE_ANONYMOUS_COMPLAINT, createAnonymousComplaintOpts);
  
  // Get user complaints (authenticated)
  server.get(ApiRoutes.GET_USER_COMPLAINTS, {
    preHandler: requireAuth,
    ...getUserComplaintsOpts
  });
  
  // Get complaint by ID (authenticated)
  server.get(ApiRoutes.GET_COMPLAINT_BY_ID, {
    preHandler: requireAuth,
    ...getComplaintByIdOpts
  });

  // Get all complaints (admin only)
  server.get(ApiRoutes.GET_ALL_COMPLAINTS, {
    preHandler: requireRole([UserRoles.ADMIN, UserRoles.DEPARTMENT_MANAGER, UserRoles.DEPARTMENT_STAFF]),
    ...getAllComplaintsOpts
  });

  // Update complaint status (admin only)
  server.patch(ApiRoutes.UPDATE_COMPLAINT, {
    preHandler: requireRole([UserRoles.ADMIN, UserRoles.DEPARTMENT_MANAGER, UserRoles.DEPARTMENT_STAFF]),
    ...updateComplaintOpts
  });
}