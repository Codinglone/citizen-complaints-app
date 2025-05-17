require('dotenv').config();

export const auth0Config = {
  domain: 'dev-l6meyuf7otica4lh.us.auth0.com',
  clientId: 'zy0eMPuk9cLjuTBUgPVtdTdqV1yhn3KB',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.VITE_AUTH0_AUDIENCE,
    scope: 'openid profile email'
  }
};