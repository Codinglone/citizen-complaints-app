export interface Auth0User {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
  iss?: string;
  aud?: string[];
  iat?: number;
  exp?: number;
  [key: string]: any; // For any additional fields
}
