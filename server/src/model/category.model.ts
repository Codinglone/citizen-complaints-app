import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';

interface CategoryListItem {
  id: string;
  name: string;
  description: string | null;
}

export class CategoryModel {
  static categoryRepository = AppDataSource.getRepository(Category);

  static async getAllCategories(): Promise<CategoryListItem[]> {
    const categories = await this.categoryRepository.find();
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description
    }));
  }
}