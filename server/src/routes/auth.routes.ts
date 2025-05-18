import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import { verifyToken, requireAuth } from "../middleware/auth.middleware";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Auth0User } from "../types/auth0";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

// Define the update profile request type
interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export function registerAuthRoutes(server: FastifyInstance) {
  // Verify token endpoint
  server.get("/api/auth/verify", {
    handler: async (request, reply) => {
      try {
        await verifyToken(request, reply);
        return { isValid: true, user: request.user };
      } catch (error) {
        return { isValid: false };
      }
    },
  });

  // Admin login endpoint (JWT based)
  server.post<{ Body: LoginRequest }>("/api/auth/login", {
    schema: {
      body: Type.Object({
        email: Type.String({ format: "email" }),
        password: Type.String(),
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          token: Type.String(),
          user: Type.Object({
            id: Type.String(),
            fullName: Type.String(),
            email: Type.String(),
            role: Type.String(),
            profileImage: Type.Union([Type.String(), Type.Null()]),
          }),
        }),
        401: Type.Object({
          error: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const userRepository = AppDataSource.getRepository(User);

      // Find user by email
      const user = await userRepository.findOne({ where: { email } });

      // Check if user exists and password is correct
      if (!user || !user.password) {
        return reply.code(401).send({ error: "Invalid email or password" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.code(401).send({ error: "Invalid email or password" });
      }

      // Check if user has admin role
      if (
        user.role !== "admin" &&
        user.role !== "department_manager" &&
        user.role !== "department_staff"
      ) {
        return reply
          .code(403)
          .send({ error: "Access denied - Admin privileges required" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "your-secret-key-for-signing-tokens",
        { expiresIn: "8h" }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      };
    },
  });

  // Register new admin user (only existing admins can create new admin accounts)
  server.post("/api/auth/register-admin", {
    schema: {
      body: Type.Object({
        fullName: Type.String(),
        email: Type.String({ format: "email" }),
        password: Type.String(),
        role: Type.String(),
        department: Type.Optional(Type.String()),
      }),
      response: {
        201: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
        }),
        400: Type.Object({
          error: Type.String(),
        }),
      },
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      // Only admins can create other admin accounts
      if (!request.dbUser || request.dbUser.role !== "admin") {
        return reply
          .code(403)
          .send({ error: "Forbidden - Admin access required" });
      }

      const { fullName, email, password, role, department } =
        request.body as any;
      const userRepository = AppDataSource.getRepository(User);

      // Check if user with this email already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return reply.code(400).send({ error: "Email already in use" });
      }

      // Validate role
      const validRoles = ["admin", "citizen"];
      if (!validRoles.includes(role)) {
        return reply.code(400).send({ error: "Invalid role" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User();
      newUser.fullName = fullName;
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.role = role;
      newUser.phoneNumber = "";

      if (department && role === "citizen") {
        newUser.department = department;
      }

      // Save user to database
      await userRepository.save(newUser);

      return reply.code(201).send({
        success: true,
        message: "Admin user created successfully",
      });
    },
  });

  // Get user profile
  server.get("/api/profile", {
    schema: {
      response: {
        200: Type.Object({
          id: Type.String(),
          fullName: Type.String(),
          email: Type.String(),
          role: Type.String(),
          profileImage: Type.Union([Type.String(), Type.Null()]),
          city: Type.Union([Type.String(), Type.Null()]),
          phoneNumber: Type.String(),
          department: Type.Union([Type.String(), Type.Null()]),
        }),
      },
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      if (!request.dbUser) {
        return reply.code(404).send({ error: "User profile not found" });
      }

      return {
        id: request.dbUser.id,
        fullName: request.dbUser.fullName,
        email: request.dbUser.email,
        role: request.dbUser.role,
        profileImage: request.dbUser.profileImage,
        city: request.dbUser.city,
        phoneNumber: request.dbUser.phoneNumber,
        department: request.dbUser.department,
      };
    },
  });

  // Update user profile
  server.patch<{ Body: UpdateProfileRequest }>("/api/profile", {
    schema: {
      body: Type.Object({
        fullName: Type.Optional(Type.String()),
        phoneNumber: Type.Optional(Type.String()),
        city: Type.Optional(Type.String()),
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          user: Type.Object({
            id: Type.String(),
            fullName: Type.String(),
            email: Type.String(),
            role: Type.String(),
            profileImage: Type.Union([Type.String(), Type.Null()]),
            city: Type.Union([Type.String(), Type.Null()]),
            phoneNumber: Type.String(),
            department: Type.Union([Type.String(), Type.Null()]),
          }),
        }),
      },
    },
    preHandler: requireAuth,
    handler: async (request, reply) => {
      if (!request.dbUser) {
        return reply.code(404).send({ error: "User profile not found" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const updateData = request.body;

      // Update user fields
      if (updateData.fullName) request.dbUser.fullName = updateData.fullName;
      if (updateData.phoneNumber)
        request.dbUser.phoneNumber = updateData.phoneNumber;
      if (updateData.city) request.dbUser.city = updateData.city;

      // Save updated user
      const updatedUser = await userRepository.save(request.dbUser);

      return {
        success: true,
        user: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
          city: updatedUser.city,
          phoneNumber: updatedUser.phoneNumber,
          department: updatedUser.department,
        },
      };
    },
  });
}
