// src/modules/suppliers/supplier.service.ts
import { SupplierRepository } from './supplier.repository';
import { AppError } from '../../utils/AppError';
import { supplierDataSchema, type UpdateSupplierInput } from './supplier.schema';
import type { Supplier, SupplierData, SupplierFilters, SupplierOption } from './supplier.types';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';

// Proveedor guardado → solo sus datos editables (para combinarlos con los cambios de un PATCH)
function toSupplierData(supplier: Supplier): SupplierData {
    return {
        supplier_type: supplier.supplier_type,
        name: supplier.name,
        legal_name: supplier.legal_name,
        document_type: supplier.document_type,
        document_number: supplier.document_number,
        nrc: supplier.nrc,
        economic_activity_code: supplier.economic_activity_code,
        district_id: supplier.district_id,
        address: supplier.address,
        phone: supplier.phone,
        phone_alt: supplier.phone_alt,
        email: supplier.email,
        contact_name: supplier.contact_name,
        applies_perception: supplier.applies_perception
    };
}

export class SupplierService {
    private supplierRepository = new SupplierRepository();

    async list(filters: SupplierFilters, pagination: PaginationParams): Promise<PaginatedResult<Supplier>> {
        return this.supplierRepository.findPage(filters, pagination);
    }

    async listOptions(): Promise<SupplierOption[]> {
        return this.supplierRepository.findOptions();
    }

    async getById(id: number): Promise<Supplier> {
        const supplier = await this.supplierRepository.findById(id);
        if (!supplier) {
            throw new AppError('Proveedor no encontrado', 404);
        }
        return supplier;
    }

    // data ya viene validada y completa por supplierDataSchema (validateSchema en la ruta)
    async create(data: SupplierData): Promise<Supplier> {
        await this.ensureNoDuplicates(data);
        return this.supplierRepository.create(data);
    }

    // PATCH: se combinan los datos actuales con los cambios y se validan COMPLETOS con las reglas del tipo.
    // Así, por ejemplo, cambiar a "sujeto excluido" limpia el NRC y la actividad automáticamente.
    async update(id: number, changes: UpdateSupplierInput): Promise<Supplier> {
        const current = await this.getById(id); // lanza 404 si no existe
        const { is_active, ...fields } = changes;

        let data: SupplierData | undefined;
        if (Object.keys(fields).length > 0) {
            const parsed = supplierDataSchema.safeParse({ ...toSupplierData(current), ...fields });
            if (!parsed.success) {
                throw new AppError(parsed.error.issues[0].message, 400);
            }
            data = parsed.data;
            await this.ensureNoDuplicates(data, id);
        }

        return this.supplierRepository.update(id, { ...data, ...(is_active !== undefined ? { is_active } : {}) });
    }

    // Borrado lógico: el proveedor queda inactivo pero se conserva para las compras que ya lo usan.
    // Se reactiva con PATCH { is_active: true }.
    async remove(id: number): Promise<void> {
        await this.getById(id);
        await this.supplierRepository.update(id, { is_active: false });
    }

    // 409 si otro proveedor ya usa el nombre, el documento o el NRC
    private async ensureNoDuplicates(data: SupplierData, excludeId?: number): Promise<void> {
        const duplicated = await this.supplierRepository.findDuplicateField(data, excludeId);
        if (duplicated) {
            throw new AppError(`Ya existe un proveedor con ${duplicated}`, 409);
        }
    }
}
