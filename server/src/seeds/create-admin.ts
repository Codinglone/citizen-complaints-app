import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from 'bcrypt';

export async function createDefaultAdmin() {
  try {
    await AppDataSource.initialize();
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({ 
      where: { email: "admin@example.com" } 
    });
    
    if (existingAdmin) {
      console.log("Admin user already exists, skipping creation");
      return;
    }
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash("adminPassword123", 10);
    
    const adminUser = new User();
    adminUser.fullName = "System Administrator";
    adminUser.email = "admin@example.com";
    adminUser.password = hashedPassword;
    adminUser.role = "admin";
    adminUser.phoneNumber = "";
    
    await userRepository.save(adminUser);
    
    console.log("Default admin user created successfully");
    
  } catch (error) {
    console.error("Error creating default admin:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Execute function if this file is run directly
if (require.main === module) {
  createDefaultAdmin()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}