// src/modules/customers/customer.service.ts
import { CustomerRepository } from './customer.repository';
import { AppError } from '../../utils/AppError';
import { customerDataSchema, type UpdateCustomerInput } from './customer.schema';
import type { Customer, CustomerData, CustomerFilters } from './customer.types';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';

// Cliente guardado → solo sus datos editables (para combinarlos con los cambios de un PATCH).
// credit_limit no va aquí: se maneja aparte porque solo can_manage_structure lo puede cambiar.
function toCustomerData(customer: Customer): CustomerData {
    return {
        customer_type: customer.customer_type,
        name: customer.name,
        trade_name: customer.trade_name,
        gender: customer.gender,
        document_type: customer.document_type,
        document_number: customer.document_number,
        nrc: customer.nrc,
        economic_activity_code: customer.economic_activity_code,
        district_id: customer.district_id,
        address: customer.address,
        phone: customer.phone,
        phone_alt: customer.phone_alt,
        email: customer.email
    };
}

export class CustomerService {
    private customerRepository = new CustomerRepository();

    async list(filters: CustomerFilters, pagination: PaginationParams): Promise<PaginatedResult<Customer>> {
        return this.customerRepository.findPage(filters, pagination);
    }

    async getById(id: number): Promise<Customer> {
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw new AppError('Cliente no encontrado', 404);
        }
        return customer;
    }

    // data ya viene validada y completa por customerDataSchema (validateSchema en la ruta)
    async create(data: CustomerData): Promise<Customer> {
        await this.ensureNoDuplicates(data);
        return this.customerRepository.create(data);
    }

    // PATCH: se combinan los datos actuales con los cambios y se validan COMPLETOS con las reglas del tipo.
    // Así, por ejemplo, cambiar a "consumidor final" limpia el NRC y la actividad automáticamente.
    async update(id: number, changes: UpdateCustomerInput): Promise<Customer> {
        const current = await this.getById(id); // lanza 404 si no existe
        const { is_active, credit_limit, ...fields } = changes;

        let data: CustomerData | undefined;
        if (Object.keys(fields).length > 0) {
            const parsed = customerDataSchema.safeParse({ ...toCustomerData(current), ...fields });
            if (!parsed.success) {
                throw new AppError(parsed.error.issues[0].message, 400);
            }
            data = parsed.data;
            await this.ensureNoDuplicates(data, id);
        }

        return this.customerRepository.update(id, {
            ...data,
            ...(credit_limit !== undefined ? { credit_limit } : {}),
            ...(is_active !== undefined ? { is_active } : {})
        });
    }

    // Borrado lógico: el cliente queda inactivo pero se conserva para las ventas que ya lo usan.
    // Se reactiva con PATCH { is_active: true }.
    async remove(id: number): Promise<void> {
        await this.getById(id);
        await this.customerRepository.update(id, { is_active: false });
    }

    // 409 si otro cliente ya usa el documento o el NRC
    private async ensureNoDuplicates(data: CustomerData, excludeId?: number): Promise<void> {
        const duplicated = await this.customerRepository.findDuplicateField(data, excludeId);
        if (duplicated) {
            throw new AppError(`Ya existe un cliente con ${duplicated}`, 409);
        }
    }
}
