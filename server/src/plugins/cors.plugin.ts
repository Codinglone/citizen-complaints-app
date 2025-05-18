import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';

export async function registerCorsPlugin(server: FastifyInstance) {
  await server.register(fastifyCors, {
    // Configure CORS settings
    origin: process.env.CORS_ORIGIN || true, // true allows all origins in development
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });
}