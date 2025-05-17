import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { User } from '../entities/User';
import { Auth0User } from '../types/auth0';

declare module 'fastify' {
  interface FastifyRequest {
    auth0User?: Auth0User;
    dbUser?: User;
  }
  
  interface FastifyInstance {
    verifyAuth0Token: (token: string) => Promise<Auth0User>;
  }
}

const requestExtensionsPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // No actual implementation needed - this plugin exists just to register the types
  console.log('Request extensions plugin registered');
};

export default fp(requestExtensionsPlugin, { name: 'requestExtensions' });