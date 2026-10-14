// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/hooks/useBrandFilters.ts
// ---------------------------------------------------------------------
// QUÉ HACE: guarda el estado de los filtros y los entrega listos para el backend.
// Solo hay DOS filtros: pestaña Activas/Inactivas y búsqueda por nombre.
//
// TAREAS:
//   [x] Aplicar la búsqueda con useDebouncedValue(search.trim(), BRAND_SEARCH_DEBOUNCE_MS)
//   [x] Incluir search en filters (si está vacío, mandar undefined)
//   [x] Calcular emptyMessage según el caso
//   [x] Devolver también emptyMessage
//
// NO CAMBIAR: los nombres que devuelve (status, setStatus, search, setSearch, filters),
// la página ya los usa.
// REFERENCIA: features/users/hooks/useUserFilters.ts (es lo mismo sin el filtro de rol)
// =====================================================================
import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { BRAND_SEARCH_DEBOUNCE_MS } from '../model/brands.constants';
import type { BrandFilters, BrandStatusTab } from '../model/brands.types';

export function useBrandFilters() {
    const [status, setStatus] = useState<BrandStatusTab>('active');
    const [search, setSearch] = useState('');

    // No se consulta al backend con cada tecla: se espera a que el usuario deje de escribir
    const debouncedSearch = useDebouncedValue(search.trim(), BRAND_SEARCH_DEBOUNCE_MS);

    // Filtros listos para enviar al backend (search vacío → undefined)
    const filters = useMemo<BrandFilters>(
        () => ({
            is_active: status === 'active',
            search: debouncedSearch || undefined,
        }),
        [status, debouncedSearch]
    );

    const emptyMessage = debouncedSearch
        ? 'No se encontraron marcas con ese nombre.'
        : status === 'active'
            ? 'Aún no hay marcas registradas.'
            : 'No hay marcas inactivas.';

    return { status, setStatus, search, setSearch, filters, emptyMessage };
}