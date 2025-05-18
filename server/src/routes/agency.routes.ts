import { FastifyInstance } from 'fastify';
import { getAllAgenciesOpts } from '../schemas/agency.schema';
import { ApiRoutes } from '../utility/enums';

export function registerAgencyRoutes(server: FastifyInstance) {
  // Get agencies
  server.get(ApiRoutes.GET_AGENCIES, getAllAgenciesOpts);
}