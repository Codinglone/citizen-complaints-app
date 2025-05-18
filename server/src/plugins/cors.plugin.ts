import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';

export async function registerCors(server: FastifyInstance) {
  server.register(fastifyCors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,              // <— allow cookies/auth headers
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
  });
}