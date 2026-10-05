// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/hooks/useBrandFilters.ts
// ---------------------------------------------------------------------
// QUÉ HACE: guarda el estado de los filtros y los entrega listos para el backend.
// Solo hay DOS filtros: pestaña Activas/Inactivas y búsqueda por nombre.
//
// ESTADO ACTUAL: mínimo y temporal. La pestaña ya filtra; la búsqueda todavía NO.
//
// TAREAS:
//   [ ] Aplicar la búsqueda con useDebouncedValue(search.trim(), BRAND_SEARCH_DEBOUNCE_MS)
//       (src/hooks/useDebouncedValue.ts) → no consultar al backend con cada tecla
//   [ ] Incluir search en filters (si está vacío, mandar undefined)
//   [ ] Calcular emptyMessage según el caso:
//         con búsqueda  → "No se encontraron marcas con ese nombre."
//         pestaña activas → "Aún no hay marcas registradas."
//         pestaña inactivas → "No hay marcas inactivas."
//   [ ] Devolver también emptyMessage
//
// NO CAMBIAR: los nombres que devuelve (status, setStatus, search, setSearch, filters),
// la página ya los usa.
// REFERENCIA: features/users/hooks/useUserFilters.ts (es lo mismo sin el filtro de rol)
// =====================================================================
import { useMemo, useState } from 'react';
import type { BrandFilters, BrandStatusTab } from '../model/brands.types';

export function useBrandFilters() {
    const [status, setStatus] = useState<BrandStatusTab>('active');
    const [search, setSearch] = useState('');

    // TODO H1: agregar search (con debounce) a los filtros
    const filters = useMemo<BrandFilters>(() => ({ is_active: status === 'active' }), [status]);

    return { status, setStatus, search, setSearch, filters };
}
