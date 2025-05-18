import { AppDataSource } from '../data-source';
import { Agency } from '../entities/Agency';

interface AgencyListItem {
  id: string;
  name: string;
  description: string | null;
}

export class AgencyModel {
  static agencyRepository = AppDataSource.getRepository(Agency);

  static async getAllAgencies(): Promise<AgencyListItem[]> {
    const agencies = await this.agencyRepository.find();
    
    return agencies.map(agency => ({
      id: agency.id,
      name: agency.name,
      description: agency.description
    }));
  }
}