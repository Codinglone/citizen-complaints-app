import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';

export class CategoryModel {
  static categoryRepository: Repository<Category> = AppDataSource.getRepository(Category);

  static async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }
  
  // Make sure this method is implemented
  static async getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}