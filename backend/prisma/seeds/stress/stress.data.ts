// prisma/seeds/stress/stress.data.ts
// Genera clientes y proveedores falsos pero válidos según las reglas del sistema (Hacienda y formularios).
// Solo arma los datos: no toca la base de datos (eso lo hace stress.seed.ts).
import { fakerES_MX as faker } from '@faker-js/faker';
import { CustomerType, DocumentType, Gender, SupplierType, type Prisma } from '@prisma/client';

// Todo lo generado lleva este dominio en el correo: así se puede borrar después sin tocar datos reales
export const STRESS_EMAIL_DOMAIN = 'stress.local';

export interface StressCatalogs {
    districtIds: number[];
    activityCodes: string[];
}

// Municipios de El Salvador para las direcciones
const SV_CITIES = [
    'San Salvador', 'Santa Ana', 'San Miguel', 'Soyapango', 'Mejicanos', 'Santa Tecla', 'Apopa',
    'Ilopango', 'La Unión', 'Usulután', 'Sonsonate', 'Chalatenango', 'Ahuachapán', 'Zacatecoluca',
    'San Vicente', 'Cojutepeque', 'Ilobasco', 'Antiguo Cuscatlán', 'Quezaltepeque', 'Metapán',
];

const BUSINESS_PREFIXES = [
    'Ferretería', 'Distribuidora', 'Comercial', 'Importadora', 'Materiales',
    'Inversiones', 'Suministros', 'Depósito', 'Agroferretería', 'Constructora',
];

// ---------- Documentos (solo dígitos, como los guarda el sistema) ----------

// DUI: 8 dígitos + dígito verificador (pesos 9..2, módulo 10)
export function generateDui(): string {
    const digits = faker.string.numeric({ length: 8, allowLeadingZeros: true });
    const sum = [...digits].reduce((total, digit, index) => total + Number(digit) * (9 - index), 0);
    const checkDigit = (10 - (sum % 10)) % 10;
    return `${digits}${checkDigit}`;
}

// NIT de 14 dígitos: municipio (4) + fecha DDMMAA (6) + correlativo (3) + verificador (1)
export function generateNit14(): string {
    const municipality = faker.helpers.arrayElement(['0614', '0210', '1217', '0511', '1101', '0315']);
    const date = faker.date.birthdate({ min: 18, max: 75, mode: 'age' });
    const ddmmyy = `${pad(date.getDate(), 2)}${pad(date.getMonth() + 1, 2)}${pad(date.getFullYear() % 100, 2)}`;
    return `${municipality}${ddmmyy}${faker.string.numeric(3)}${faker.string.numeric(1)}`;
}

// NRC: 6 o 7 dígitos (sin guion)
export function generateNrc(): string {
    return faker.string.numeric({ length: faker.helpers.arrayElement([6, 7]), allowLeadingZeros: false });
}

// Teléfono de El Salvador: fijo empieza con 2; celular con 6 o 7
export function generatePhone(kind: 'mobile' | 'landline' = 'mobile'): string {
    const first = kind === 'landline' ? '2' : faker.helpers.arrayElement(['6', '7']);
    return `${first}${faker.string.numeric(3)}-${faker.string.numeric(4)}`;
}

// ---------- Datos de apoyo ----------

function pad(value: number, length: number): string {
    return String(value).padStart(length, '0');
}

// Nombre salvadoreño: nombre(s) + dos apellidos
function personName(sex: 'male' | 'female'): string {
    const firstNames = faker.helpers.maybe(() => `${faker.person.firstName(sex)} ${faker.person.firstName(sex)}`, { probability: 0.5 })
        ?? faker.person.firstName(sex);
    return `${firstNames} ${faker.person.lastName()} ${faker.person.lastName()}`;
}

function businessName(sequence: number): string {
    // El número final garantiza nombres únicos (los proveedores tienen name @unique)
    return `${faker.helpers.arrayElement(BUSINESS_PREFIXES)} ${faker.person.lastName()} ${pad(sequence, 6)}`;
}

function address(): string {
    return `${faker.location.street()} #${faker.number.int({ min: 1, max: 999 })}, ${faker.helpers.arrayElement(SV_CITIES)}`;
}

function stressEmail(base: string, sequence: number): string {
    const local = faker.helpers.slugify(base).toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '').slice(0, 60);
    return `${local}.${sequence}@${STRESS_EMAIL_DOMAIN}`;
}

function pastDate(): Date {
    return faker.date.past({ years: 3 });
}

// ---------- Clientes ----------

export function buildCustomer(sequence: number, catalogs: StressCatalogs): Prisma.CustomerCreateManyInput {
    const isActive = faker.datatype.boolean({ probability: 0.9 });
    const isTaxpayer = faker.datatype.boolean({ probability: 0.3 });

    if (isTaxpayer) {
        // Contribuyente: NIT o DUI, NRC, actividad, distrito, dirección y correo obligatorios
        const usesNit14 = faker.datatype.boolean();
        const name = faker.datatype.boolean({ probability: 0.6 }) ? `${faker.company.name()} S.A. de C.V.` : personName(faker.person.sex() as 'male' | 'female');
        return {
            customer_type: CustomerType.Taxpayer,
            name: name.slice(0, 200),
            trade_name: faker.helpers.maybe(() => businessName(sequence), { probability: 0.5 }) ?? null,
            document_type: usesNit14 ? DocumentType.NIT : DocumentType.DUI,
            document_number: usesNit14 ? generateNit14() : generateDui(),
            nrc: generateNrc(),
            economic_activity_code: faker.helpers.arrayElement(catalogs.activityCodes),
            district_id: faker.helpers.arrayElement(catalogs.districtIds),
            address: address(),
            phone: generatePhone(faker.helpers.arrayElement(['mobile', 'landline'])),
            phone_alt: faker.helpers.maybe(() => generatePhone(), { probability: 0.3 }) ?? null,
            email: stressEmail(name, sequence),
            credit_limit: faker.helpers.maybe(() => faker.number.int({ min: 5, max: 50 }) * 100, { probability: 0.3 }) ?? 0,
            is_active: isActive,
            created_at: pastDate(),
        };
    }

    // Consumidor final: solo el nombre es obligatorio; lo demás aparece a veces
    const sex = faker.person.sex() as 'male' | 'female';
    const name = personName(sex);
    const hasDui = faker.datatype.boolean({ probability: 0.6 });
    const hasLocation = faker.datatype.boolean({ probability: 0.4 });
    return {
        customer_type: CustomerType.FinalConsumer,
        name,
        gender: faker.helpers.maybe(() => (sex === 'male' ? Gender.M : Gender.F), { probability: 0.7 }) ?? null,
        document_type: hasDui ? DocumentType.DUI : null,
        document_number: hasDui ? generateDui() : null,
        district_id: hasLocation ? faker.helpers.arrayElement(catalogs.districtIds) : null,
        address: hasLocation ? address() : null,
        phone: faker.helpers.maybe(() => generatePhone(), { probability: 0.7 }) ?? null,
        email: stressEmail(name, sequence), // siempre lleva correo @stress.local para poder limpiarlos
        is_active: isActive,
        created_at: pastDate(),
    };
}

// ---------- Proveedores ----------

export function buildSupplier(sequence: number, catalogs: StressCatalogs): Prisma.SupplierCreateManyInput {
    const name = businessName(sequence);
    const base = {
        name,
        district_id: faker.helpers.arrayElement(catalogs.districtIds),
        address: address(),
        email: stressEmail(name, sequence),
        is_active: faker.datatype.boolean({ probability: 0.9 }),
        created_at: pastDate(),
    };

    if (faker.datatype.boolean({ probability: 0.7 })) {
        // Contribuyente: NIT, NRC, razón social, actividad y contacto
        return {
            ...base,
            supplier_type: SupplierType.Taxpayer,
            legal_name: `${faker.company.name()} S.A. de C.V.`.slice(0, 200),
            document_type: DocumentType.NIT,
            document_number: faker.datatype.boolean() ? generateNit14() : generateDui(),
            nrc: generateNrc(),
            economic_activity_code: faker.helpers.arrayElement(catalogs.activityCodes),
            phone: faker.helpers.maybe(() => generatePhone('landline'), { probability: 0.8 }) ?? null,
            contact_name: personName(faker.person.sex() as 'male' | 'female'),
            applies_perception: faker.datatype.boolean({ probability: 0.2 }),
        };
    }

    // Sujeto excluido: DUI y teléfono obligatorios, sin NRC
    return {
        ...base,
        supplier_type: SupplierType.ExcludedSubject,
        document_type: DocumentType.DUI,
        document_number: generateDui(),
        phone: generatePhone(),
    };
}
