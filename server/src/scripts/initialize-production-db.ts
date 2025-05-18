import { AppDataSource } from '../data-source';
import * as dotenv from 'dotenv';
import { QueryRunner } from 'typeorm';
import * as readline from 'readline';

dotenv.config();

// Utility to ask for confirmation
function askForConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(`${question} (yes/no): `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

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

async function initializeDatabase() {
  try {
    console.log('Initializing connection to production database...');
    
    // Make sure NODE_ENV is set to production
    process.env.NODE_ENV = 'production';
    
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    
    const queryRunner = AppDataSource.createQueryRunner();
    
    // Check if any tables exist
    const userTableExists = await checkTableExists(queryRunner, 'user');
    const agencyTableExists = await checkTableExists(queryRunner, 'agency');
    const categoryTableExists = await checkTableExists(queryRunner, 'category');
    const complaintTableExists = await checkTableExists(queryRunner, 'complaint');
    
    console.log('Current database status:');
    console.log(`- User table: ${userTableExists ? 'exists' : 'does not exist'}`);
    console.log(`- Agency table: ${agencyTableExists ? 'exists' : 'does not exist'}`);
    console.log(`- Category table: ${categoryTableExists ? 'exists' : 'does not exist'}`);
    console.log(`- Complaint table: ${complaintTableExists ? 'exists' : 'does not exist'}`);
    
    if (userTableExists || agencyTableExists || categoryTableExists || complaintTableExists) {
      const shouldContinue = await askForConfirmation('Some tables already exist. Do you want to continue? This will NOT drop existing tables but update them if needed.');
      if (!shouldContinue) {
        console.log('Operation cancelled by user.');
        await AppDataSource.destroy();
        process.exit(0);
      }
    }
    
    // Create extension for UUID support
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    console.log('Creating or updating tables...');
    
    // Create User table if not exists
    if (!userTableExists) {
      console.log('Creating User table...');
      await queryRunner.query(`
        CREATE TABLE "user" (
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
    }
    
    // Create Agency table if not exists
    if (!agencyTableExists) {
      console.log('Creating Agency table...');
      await queryRunner.query(`
        CREATE TABLE "agency" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "name" varchar NOT NULL,
          "description" text NOT NULL DEFAULT 'No description provided',
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
    } else {
      // Only update agency description if the table exists
      console.log('Agency table exists, updating if needed...');
      
      // Double check that the agency table really exists before updating
      const doubleCheckAgency = await checkTableExists(queryRunner, 'agency');
      if (doubleCheckAgency) {
        // First check if the description column exists
        const descColumnExists = await queryRunner.query(`
          SELECT COUNT(*) 
          FROM information_schema.columns 
          WHERE table_name = 'agency' 
          AND column_name = 'description'
        `);
        
        if (parseInt(descColumnExists[0].count) > 0) {
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
        } else {
          console.log('Description column does not exist in agency table, adding it...');
          await queryRunner.query(`
            ALTER TABLE "agency" 
            ADD COLUMN "description" text NOT NULL DEFAULT 'No description provided'
          `);
        }
      } else {
        console.log('Warning: Agency table check inconsistency. Creating agency table...');
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "agency" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" varchar NOT NULL,
            "description" text NOT NULL DEFAULT 'No description provided',
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
      }
    }
    
    // Create Category table if not exists
    if (!categoryTableExists) {
      console.log('Creating Category table...');
      await queryRunner.query(`
        CREATE TABLE "category" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "name" varchar NOT NULL,
          "description" varchar,
          "isActive" boolean NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
    }
    
    // Create Complaint table if not exists
    if (!complaintTableExists) {
      console.log('Creating Complaint table...');
      await queryRunner.query(`
        CREATE TABLE "complaint" (
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
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // Check if tables exist before adding foreign keys
      if (userTableExists) {
        console.log('Adding user foreign key to complaint table...');
        await queryRunner.query(`
          ALTER TABLE "complaint" 
          ADD CONSTRAINT "FK_user" 
          FOREIGN KEY ("userId") 
          REFERENCES "user" ("id")
        `);
      }
      
      if (agencyTableExists) {
        console.log('Adding agency foreign key to complaint table...');
        await queryRunner.query(`
          ALTER TABLE "complaint" 
          ADD CONSTRAINT "FK_agency" 
          FOREIGN KEY ("agencyId") 
          REFERENCES "agency" ("id")
        `);
      }
      
      if (categoryTableExists) {
        console.log('Adding category foreign key to complaint table...');
        await queryRunner.query(`
          ALTER TABLE "complaint" 
          ADD CONSTRAINT "FK_category" 
          FOREIGN KEY ("categoryId") 
          REFERENCES "category" ("id")
        `);
      }
    }
    
    // Create Notification table if not exists
    const notificationTableExists = await checkTableExists(queryRunner, 'notification');
    if (!notificationTableExists) {
      console.log('Creating Notification table...');
      await queryRunner.query(`
        CREATE TABLE "notification" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "type" varchar NOT NULL,
          "message" text NOT NULL,
          "isRead" boolean NOT NULL DEFAULT false,
          "userId" uuid NOT NULL,
          "complaintId" uuid,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // Add foreign keys if parent tables exist
      if (userTableExists) {
        await queryRunner.query(`
          ALTER TABLE "notification" 
          ADD CONSTRAINT "FK_notification_user" 
          FOREIGN KEY ("userId") 
          REFERENCES "user" ("id")
        `);
      }
      
      if (complaintTableExists) {
        await queryRunner.query(`
          ALTER TABLE "notification" 
          ADD CONSTRAINT "FK_notification_complaint" 
          FOREIGN KEY ("complaintId") 
          REFERENCES "complaint" ("id")
        `);
      }
    }
    
    // Create notification_preferences table if not exists
    const notificationPrefsTableExists = await checkTableExists(queryRunner, 'notification_preferences');
    if (!notificationPrefsTableExists) {
      console.log('Creating Notification Preferences table...');
      await queryRunner.query(`
        CREATE TABLE "notification_preferences" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "userId" uuid NOT NULL UNIQUE,
          "emailNotifications" boolean NOT NULL DEFAULT true,
          "statusUpdates" boolean NOT NULL DEFAULT true,
          "commentNotifications" boolean NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // Add foreign key if user table exists
      if (userTableExists) {
        await queryRunner.query(`
          ALTER TABLE "notification_preferences" 
          ADD CONSTRAINT "FK_notification_prefs_user" 
          FOREIGN KEY ("userId") 
          REFERENCES "user" ("id")
        `);
      }
    }
    
    // Create migrations table to keep track of migrations
    const migrationsTableExists = await checkTableExists(queryRunner, 'migrations');
    if (!migrationsTableExists) {
      console.log('Creating migrations tracking table...');
      await queryRunner.query(`
        CREATE TABLE "migrations" (
          "id" SERIAL PRIMARY KEY,
          "timestamp" bigint NOT NULL,
          "name" varchar NOT NULL
        )
      `);
      
      // Insert records for completed migrations
      await queryRunner.query(`
        INSERT INTO "migrations" ("timestamp", "name") 
        VALUES 
        (1700000000000, 'InitialSchema1700000000000'),
        (1710000000000, 'UpdateAgencyDescription1710000000000'),
        (1715987500000, 'UpdateComplaintEntity1715987500000')
      `);
    }
    
    console.log('Database initialization completed successfully');
    
    await AppDataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();