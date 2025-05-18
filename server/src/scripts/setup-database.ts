import { AppDataSource } from '../data-source';
import * as dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  try {
    console.log('Initializing connection to database...');
    
    // Set to production mode if needed
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in PRODUCTION mode');
    } else {
      console.log('Running in DEVELOPMENT mode');
    }
    
    // Initialize TypeORM - this will create all tables due to synchronize: true
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    console.log('Tables should be created automatically due to synchronize: true');
    
    console.log('Database setup completed successfully');
    
    await AppDataSource.destroy();
    console.log('Database connection closed');
    
    // IMPORTANT REMINDER
    console.log('\n⚠️ IMPORTANT: For production use, set synchronize: false in data-source.ts after initial setup!');
    console.log('   Leaving synchronize: true can cause data loss when entity definitions change.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();