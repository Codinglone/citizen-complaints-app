import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

interface LoginRequest {
  Body: {
    email: string;
    password: string;
  }
}

export async function loginController(
  request: FastifyRequest<LoginRequest>,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body;
    
    // Find user by email
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'role'] // Include password for verification
    });
    
    if (!user) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token with explicit algorithm
    const token = request.server.jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      { algorithm: 'HS256' }
    );
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Login failed' });
  }
}

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  // Implement user registration here
  // ...
}