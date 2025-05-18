import { AppDataSource } from "../data-source";
import { Category } from "../entities/Category";

export async function createDefaultCategories() {
  try {
    await AppDataSource.initialize();
    
    const categoryRepository = AppDataSource.getRepository(Category);
    
    // Check if categories already exist
    const existingCategories = await categoryRepository.find();
    
    if (existingCategories.length > 0) {
      console.log("Categories already exist, skipping creation");
      return;
    }
    
    // Create default categories
    const categories = [
      {
        name: "Roads & Infrastructure",
        description: "Issues related to roads, potholes, bridges, sidewalks, etc."
      },
      {
        name: "Water & Sewage",
        description: "Issues with water supply, quality, leaks, sewage problems"
      },
      {
        name: "Waste Management",
        description: "Problems with garbage collection, illegal dumping, recycling"
      },
      {
        name: "Electricity",
        description: "Power outages, damaged electrical infrastructure, street lights"
      },
      {
        name: "Public Transport",
        description: "Issues with buses, trains, transit stations, schedules"
      },
      {
        name: "Noise Pollution",
        description: "Excessive noise from businesses, construction, events"
      },
      {
        name: "Environmental Hazards",
        description: "Pollution, toxic spills, air quality problems"
      },
      {
        name: "Public Safety",
        description: "Unsafe conditions, damaged safety equipment, hazards"
      },
      {
        name: "Other",
        description: "Other issues not falling in above categories"
      }
    ];
    
    for (const categoryData of categories) {
      const category = new Category();
      category.name = categoryData.name;
      category.description = categoryData.description;
      
      await categoryRepository.save(category);
    }
    
    console.log("Default categories created successfully");
    
  } catch (error) {
    console.error("Error creating default categories:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Execute function if this file is run directly
if (require.main === module) {
  createDefaultCategories()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}