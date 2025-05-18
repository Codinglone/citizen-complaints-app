import { AppDataSource } from '../data-source';
import * as dotenv from 'dotenv';
import { Agency } from '../entities/Agency';
import { Category } from '../entities/Category';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('Initializing connection to database...');
    
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    
    // Check if we already have data
    const userCount = await AppDataSource.manager.count(User);
    const agencyCount = await AppDataSource.manager.count(Agency);
    const categoryCount = await AppDataSource.manager.count(Category);
    
    console.log(`Existing data: ${userCount} users, ${agencyCount} agencies, ${categoryCount} categories`);
    
    // Create admin user if it doesn't exist
    if (userCount === 0) {
      console.log('Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      
      const adminUser = new User();
      adminUser.fullName = 'System Administrator';
      adminUser.email = 'admin@example.com';
      adminUser.password = hashedPassword;
      adminUser.role = 'admin';
      adminUser.phoneNumber = '';
      
      await AppDataSource.manager.save(adminUser);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping creation');
    }
    
    // Create sample agencies if they don't exist
    if (agencyCount === 0) {
      console.log('Creating sample agencies...');
      
      const agencies = [
        {
          name: 'Department of Public Works',
          description: 'Responsible for maintaining public infrastructure such as roads, bridges, and public buildings.',
          email: 'dpw@citygov.example',
          phone: '555-123-4567',
          categories: ['Infrastructure', 'Roads', 'Public Buildings'],
          jurisdictions: ['City Center', 'North District', 'South District']
        },
        {
          name: 'Parks & Recreation Department',
          description: 'Manages and maintains city parks, recreational areas, and related programs.',
          email: 'parks@citygov.example',
          phone: '555-234-5678',
          categories: ['Parks', 'Recreation', 'Public Spaces'],
          jurisdictions: ['All Districts']
        },
        {
          name: 'Environmental Protection Agency',
          description: 'Monitors and enforces environmental regulations to protect natural resources.',
          email: 'environment@citygov.example',
          phone: '555-345-6789',
          categories: ['Environment', 'Pollution', 'Conservation'],
          jurisdictions: ['City-wide']
        }
      ];
      
      for (const agencyData of agencies) {
        const agency = new Agency();
        agency.name = agencyData.name;
        agency.description = agencyData.description;
        agency.email = agencyData.email;
        agency.phone = agencyData.phone;
        agency.categories = agencyData.categories;
        agency.jurisdictions = agencyData.jurisdictions;
        
        await AppDataSource.manager.save(agency);
      }
      
      console.log('Sample agencies created successfully');
    } else {
      console.log('Agencies already exist, skipping creation');
    }
    
    // Create sample categories if they don't exist
    if (categoryCount === 0) {
      console.log('Creating sample categories...');
      
      const categories = [
        {
          name: 'Road Maintenance',
          description: 'Issues related to road conditions, potholes, and street repairs.'
        },
        {
          name: 'Waste Management',
          description: 'Concerns about trash collection, recycling, and waste disposal.'
        },
        {
          name: 'Public Safety',
          description: 'Issues regarding safety hazards, street lighting, and security concerns.'
        },
        {
          name: 'Parks & Green Spaces',
          description: 'Matters related to parks maintenance, playground equipment, and public green spaces.'
        },
        {
          name: 'Public Transportation',
          description: 'Feedback about bus services, schedules, and transportation infrastructure.'
        },
        {
          name: 'Water & Utility Services',
          description: 'Issues with water quality, supply, and other utility services.'
        }
      ];
      
      for (const categoryData of categories) {
        const category = new Category();
        category.name = categoryData.name;
        category.description = categoryData.description;
        
        await AppDataSource.manager.save(category);
      }
      
      console.log('Sample categories created successfully');
    } else {
      console.log('Categories already exist, skipping creation');
    }
    
    console.log('Database seeding completed successfully');
    await AppDataSource.destroy();
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();