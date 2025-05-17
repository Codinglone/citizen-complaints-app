import { FastifyInstance } from 'fastify';
import { registerAuthRoutes } from './auth.routes';
import { registerComplaintRoutes } from './complaint.routes';
import { registerUserRoutes } from './user.routes';
// Import other route modules as needed

export function registerRoutes(server: FastifyInstance) {
  registerAuthRoutes(server);
  registerComplaintRoutes(server);
  registerUserRoutes(server);
  // Register other routes
}