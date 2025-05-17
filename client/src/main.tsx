import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';
import './i18n';

// Get Auth0 config from environment variables
const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-l6meyuf7otica4lh.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'zy0eMPuk9cLjuTBUgPVtdTdqV1yhn3KB';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://dev-l6meyuf7otica4lh.us.auth0.com/api/v2/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: 'openid profile email'
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
