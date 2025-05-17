import { User } from '../entities/User';
import { Auth0User } from './auth0';

declare module 'fastify' {
  interface FastifyRequest {
    user?: Auth0User;
    dbUser?: User;
  }
  
  interface FastifyInstance {
    verifyAuth0Token: (token: string) => Promise<Auth0User>;
  }
}

// This tells fastify-jwt what type to use for decoded tokens
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: Auth0User;
  }
}
