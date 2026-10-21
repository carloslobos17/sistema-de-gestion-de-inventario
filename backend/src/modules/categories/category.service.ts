// src/modules/categories/category.service.ts
import { CategoryRepository } from './category.repository';
import { AppError } from '../../utils/AppError';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema';
import type { Category, CategoryFilters, CategoryOption } from './category.types';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';

export class CategoryService {
    private categoryRepository = new CategoryRepository();

    async list(filters: CategoryFilters, pagination: PaginationParams): Promise<PaginatedResult<Category>> {
        return this.categoryRepository.findPage(filters, pagination);
    }

    async listOptions(): Promise<CategoryOption[]> {
        return this.categoryRepository.findOptions();
    }

    async getById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new AppError('Categoría no encontrada', 404);
        }
        return category;
    }

    async create(data: CreateCategoryInput): Promise<Category> {
        if (await this.categoryRepository.existsByName(data.name)) {
            throw new AppError('Ya existe una categoría con ese nombre', 409);
        }

        return this.categoryRepository.create({ name: data.name });
    }

    async update(id: number, data: UpdateCategoryInput): Promise<Category> {
        const category = await this.getById(id);

        if (data.name && data.name !== category.name) {
            if (await this.categoryRepository.existsByName(data.name, id)) {
                throw new AppError('Ya existe una categoría con ese nombre', 409);
            }
        }

        return this.categoryRepository.update(id, data);
    }

    // Borrado lógico: la categoría queda inactiva pero se conserva para los productos que ya la usan.
    // Se reactiva con PATCH { is_active: true }.
    async remove(id: number): Promise<void> {
        await this.getById(id); // lanza 404 si no existe
        await this.categoryRepository.update(id, { is_active: false });
    }
}
