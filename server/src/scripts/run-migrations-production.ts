import { AppDataSource } from '../data-source';
import * as dotenv from 'dotenv';
import { QueryRunner } from 'typeorm';

dotenv.config();

async function checkTableExists(queryRunner: QueryRunner, tableName: string): Promise<boolean> {
  const result = await queryRunner.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `, [tableName]);
  
  return result[0].exists;
}

async function runMigrations() {
  try {
    console.log('Initializing connection to production database...');
    
    // Make sure NODE_ENV is set to production
    process.env.NODE_ENV = 'production';
    
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    
    const queryRunner = AppDataSource.createQueryRunner();
    
    // Check if any tables exist
    const userTableExists = await checkTableExists(queryRunner, 'user');
    console.log(`Checking if tables exist: user table ${userTableExists ? 'exists' : 'does not exist'}`);
    
    if (!userTableExists) {
      console.log('Running initial schema creation...');
      
      // Create extension for UUID support
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      
      // Create User table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "email" varchar NOT NULL UNIQUE,
          "password" varchar,
          "fullName" varchar NOT NULL,
          "role" varchar NOT NULL DEFAULT 'citizen',
          "isActive" boolean NOT NULL DEFAULT true,
          "phoneNumber" varchar DEFAULT '',
          "city" varchar,
          "auth0Id" varchar,
          "department" varchar,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // Create Agency table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "agency" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "name" varchar NOT NULL,
          "description" text DEFAULT 'No description provided',
          "email" varchar,
          "phone" varchar,
          "address" varchar,
          "isActive" boolean NOT NULL DEFAULT true,
          "categories" text[],
          "jurisdictions" text[],
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // Create Category table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "category" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "name" varchar NOT NULL,
          "description" varchar,
          "isActive" boolean NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // Create Complaint table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "complaint" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "title" varchar NOT NULL,
          "description" text NOT NULL,
          "location" varchar,
          "sentimentScore" numeric,
          "language" varchar,
          "status" varchar NOT NULL DEFAULT 'pending',
          "priority" varchar NOT NULL DEFAULT 'medium',
          "trackingCode" varchar,
          "contactEmail" varchar,
          "contactPhone" varchar,
          "userId" uuid,
          "agencyId" uuid,
          "categoryId" uuid NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "user" ("id"),
          CONSTRAINT "FK_agency" FOREIGN KEY ("agencyId") REFERENCES "agency" ("id"),
          CONSTRAINT "FK_category" FOREIGN KEY ("categoryId") REFERENCES "category" ("id")
        )
      `);
      
      // Create Notification table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "notification" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "type" varchar NOT NULL,
          "message" text NOT NULL,
          "isRead" boolean NOT NULL DEFAULT false,
          "userId" uuid NOT NULL,
          "complaintId" uuid,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "FK_notification_user" FOREIGN KEY ("userId") REFERENCES "user" ("id"),
          CONSTRAINT "FK_notification_complaint" FOREIGN KEY ("complaintId") REFERENCES "complaint" ("id")
        )
      `);
      
      // Create notification_preferences table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "notification_preferences" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "userId" uuid NOT NULL UNIQUE,
          "emailNotifications" boolean NOT NULL DEFAULT true,
          "statusUpdates" boolean NOT NULL DEFAULT true,
          "commentNotifications" boolean NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "FK_notification_prefs_user" FOREIGN KEY ("userId") REFERENCES "user" ("id")
        )
      `);
      
      console.log('Initial schema created successfully');
      
      // Create migrations table to keep track of migrations
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "migrations" (
          "id" SERIAL PRIMARY KEY,
          "timestamp" bigint NOT NULL,
          "name" varchar NOT NULL
        )
      `);
      
      // Insert record for initial migration
      await queryRunner.query(`
        INSERT INTO "migrations" ("timestamp", "name") 
        VALUES (1700000000000, 'InitialSchema1700000000000')
      `);
    }
    
    // Check if agency table exists and has the description constraint
    const agencyTableExists = await checkTableExists(queryRunner, 'agency');
    if (agencyTableExists) {
      console.log('Agency table exists, updating description if needed...');
      
      // Update agency descriptions that are NULL
      await queryRunner.query(`
        UPDATE "agency" 
        SET "description" = 'No description provided' 
        WHERE "description" IS NULL
      `);
      
      // Check if we need to add the NOT NULL constraint
      const result = await queryRunner.query(`
        SELECT COUNT(*) 
        FROM information_schema.columns 
        WHERE table_name = 'agency' 
        AND column_name = 'description' 
        AND is_nullable = 'YES'
      `);
      
      if (parseInt(result[0].count) > 0) {
        console.log('Setting NOT NULL constraint on agency.description');
        await queryRunner.query(`
          ALTER TABLE "agency" 
          ALTER COLUMN "description" SET NOT NULL
        `);
      }
      
      // Insert record for agency description migration
      await queryRunner.query(`
        INSERT INTO "migrations" ("timestamp", "name") 
        VALUES (1710000000000, 'UpdateAgencyDescription1710000000000')
        ON CONFLICT DO NOTHING
      `);
    }
    
    // Finally, run any remaining pending migrations
    console.log('Running remaining migrations...');
    const migrations = await AppDataSource.runMigrations();
    console.log(`Successfully ran ${migrations.length} additional migrations`);
    
    await AppDataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();