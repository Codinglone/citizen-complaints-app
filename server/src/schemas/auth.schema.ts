import { Type } from '@sinclair/typebox';

export const Auth0UserSchema = Type.Object({
  sub: Type.String(),
  email: Type.Optional(Type.String({ format: 'email' })),
  email_verified: Type.Optional(Type.Boolean()),
  name: Type.Optional(Type.String()),
  nickname: Type.Optional(Type.String()),
  picture: Type.Optional(Type.String({ format: 'uri' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

export const Auth0TokenSchema = Type.Object({
  iss: Type.String({ format: 'uri' }),
  sub: Type.String(),
  aud: Type.Array(Type.String()),
  iat: Type.Number(),
  exp: Type.Number(),
  azp: Type.Optional(Type.String()),
  scope: Type.Optional(Type.String()),
});

export type Auth0User = typeof Auth0UserSchema.type;
export type Auth0Token = typeof Auth0TokenSchema.type;