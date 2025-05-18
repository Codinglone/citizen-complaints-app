import { FastifyRequest, FastifyReply } from 'fastify';
import { AgencyModel } from '../model/agency.model';

export async function getAllAgenciesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    return await AgencyModel.getAllAgencies();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Failed to fetch agencies' });
  }
}