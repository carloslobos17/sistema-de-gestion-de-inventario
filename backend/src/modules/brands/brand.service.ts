// src/modules/brands/brand.service.ts
import { BrandRepository } from './brand.repository';
import { AppError } from '../../utils/AppError';
import type { CreateBrandInput, UpdateBrandInput } from './brand.schema';
import type { Brand, BrandFilters } from './brand.types';

export class BrandService {
    private brandRepository = new BrandRepository();

    async list(filters: BrandFilters = {}): Promise<Brand[]> {
        return this.brandRepository.findAll(filters);
    }

    async getById(id: number): Promise<Brand> {
        const brand = await this.brandRepository.findById(id);
        if (!brand) {
            throw new AppError('Marca no encontrada', 404);
        }
        return brand;
    }

    async create(data: CreateBrandInput): Promise<Brand> {
        if (await this.brandRepository.existsByName(data.name)) {
            throw new AppError('Ya existe una marca con ese nombre', 409);
        }

        return this.brandRepository.create({ name: data.name });
    }

    async update(id: number, data: UpdateBrandInput): Promise<Brand> {
        const brand = await this.getById(id);

        if (data.name && data.name !== brand.name) {
            if (await this.brandRepository.existsByName(data.name, id)) {
                throw new AppError('Ya existe una marca con ese nombre', 409);
            }
        }

        return this.brandRepository.update(id, data);
    }

    // Borrado lógico: la marca queda inactiva pero se conserva para los productos que ya la usan.
    // Se reactiva con PATCH { is_active: true }.
    async remove(id: number): Promise<void> {
        await this.getById(id); // lanza 404 si no existe
        await this.brandRepository.update(id, { is_active: false });
    }
}
