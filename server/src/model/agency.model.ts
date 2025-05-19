import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Agency } from "../entities/Agency";

export class AgencyModel {
  static agencyRepository: Repository<Agency> =
    AppDataSource.getRepository(Agency);

  static async getAll(): Promise<Agency[]> {
    // Instead of the default find() which tries to select all columns:
    return this.agencyRepository
      .createQueryBuilder("Agency")
      .select([
        "Agency.id",
        "Agency.name",
        "Agency.description"
      ])
      .getMany();
  }

  static async findById(id: string): Promise<Agency | null> {
    // Use the same approach as getAll to avoid missing column errors
    return this.agencyRepository
      .createQueryBuilder("Agency")
      .select([
        "Agency.id",
        "Agency.name",
        "Agency.description"
      ])
      .where("Agency.id = :id", { id })
      .getOne();
  }
}
