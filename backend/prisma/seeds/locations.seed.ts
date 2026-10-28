// prisma/seeds/locations.seed.ts
// Carga departamentos, municipios y distritos de Hacienda. Usa upsert: se puede correr varias veces sin duplicar.
import type { PrismaClient } from '@prisma/client';
import { DEPARTMENTS, DISTRICTS, MUNICIPALITIES } from './data/locations.data';

export async function seedLocations(prisma: PrismaClient): Promise<void> {
    // 1. Departamentos (el código es la llave)
    await prisma.$transaction(
        DEPARTMENTS.map((department) =>
            prisma.department.upsert({
                where: { code: department.code },
                update: { name: department.name },
                create: department
            })
        )
    );

    // 2. Municipios (el código solo es único dentro de su departamento)
    await prisma.$transaction(
        MUNICIPALITIES.map((municipality) =>
            prisma.municipality.upsert({
                where: {
                    department_code_code: { department_code: municipality.departmentCode, code: municipality.code }
                },
                update: { name: municipality.name },
                create: { department_code: municipality.departmentCode, code: municipality.code, name: municipality.name }
            })
        )
    );

    // 3. Distritos: se busca el id del municipio por (departamento, código)
    const municipalities = await prisma.municipality.findMany({
        select: { id: true, department_code: true, code: true }
    });
    const municipalityIdByKey = new Map(municipalities.map((m) => [`${m.department_code}-${m.code}`, m.id]));

    await prisma.$transaction(
        DISTRICTS.map((district) => {
            const municipalityId = municipalityIdByKey.get(`${district.departmentCode}-${district.municipalityCode}`);
            if (municipalityId === undefined) {
                throw new Error(`Municipio no encontrado para el distrito ${district.name}`);
            }

            return prisma.district.upsert({
                where: { municipality_id_code: { municipality_id: municipalityId, code: district.code } },
                update: { name: district.name },
                create: { municipality_id: municipalityId, code: district.code, name: district.name }
            });
        })
    );

    console.log(
        `✔ Ubicaciones: ${DEPARTMENTS.length} departamentos, ${MUNICIPALITIES.length} municipios, ${DISTRICTS.length} distritos`
    );
}
