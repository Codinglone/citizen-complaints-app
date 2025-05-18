import Fastify, { FastifyInstance } from 'fastify';
import { registerSwaggerPlugin } from './plugins/swagger.plugin';
import { registerCorsPlugin } from './plugins/cors.plugin';
import { registerAuthPlugin } from './plugins/auth.plugin';
import { registerRoutes } from './routes/index'; // Changed from registerAllRoutes to registerRoutes

export async function buildApp(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            headers: request.headers,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket.remotePort
          };
        }
      }
    },
    trustProxy: true
  });
  
  // Register plugins
  await registerCorsPlugin(server);
  await registerAuthPlugin(server);
  await registerSwaggerPlugin(server);
  
  // Register all routes
  registerRoutes(server); // Changed from registerAllRoutes to registerRoutes
  
  return server;
}