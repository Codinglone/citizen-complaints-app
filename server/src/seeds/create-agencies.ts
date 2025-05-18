import { AppDataSource } from "../data-source";
import { Agency } from "../entities/Agency";

export async function createDefaultAgencies() {
  try {
    await AppDataSource.initialize();
    
    const agencyRepository = AppDataSource.getRepository(Agency);
    
    // Check if agencies already exist
    const existingAgencies = await agencyRepository.find();
    
    if (existingAgencies.length > 0) {
      console.log("Agencies already exist, skipping creation");
      return;
    }
    
    // Create default agencies
    const agencies = [
      {
        name: "Department of Transportation",
        contactEmail: "transport@cityagency.gov",
        description: "Handles all road and transportation related issues"
      },
      {
        name: "Water Authority",
        contactEmail: "water@cityagency.gov",
        description: "Responsible for water supply and sewage management"
      },
      {
        name: "Waste Management",
        contactEmail: "waste@cityagency.gov",
        description: "Handles garbage collection and disposal services"
      },
      {
        name: "Environmental Protection",
        contactEmail: "environment@cityagency.gov",
        description: "Deals with pollution, noise complaints, and environmental issues"
      },
      {
        name: "Public Works",
        contactEmail: "publicworks@cityagency.gov",
        description: "Maintains public infrastructure and facilities"
      },
      {
        name: "Electricity Board",
        contactEmail: "electricity@cityagency.gov",
        description: "Handles electricity distribution and related complaints"
      }
    ];
    
    for (const agencyData of agencies) {
      const agency = new Agency();
      agency.name = agencyData.name;
      agency.contactEmail = agencyData.contactEmail;
      agency.description = agencyData.description;
      
      await agencyRepository.save(agency);
    }
    
    console.log("Default agencies created successfully");
    
  } catch (error) {
    console.error("Error creating default agencies:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Execute function if this file is run directly
if (require.main === module) {
  createDefaultAgencies()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}