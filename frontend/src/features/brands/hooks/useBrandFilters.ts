import { useMemo, useState } from 'react';
import type { BrandFilters, BrandStatusTab } from '../model/brands.types';

export function useBrandFilters() {
    const [status, setStatus] = useState<BrandStatusTab>('active');
    const [search, setSearch] = useState('');

    // TODO H1: agregar search (con debounce) a los filtros
    const filters = useMemo<BrandFilters>(() => ({ is_active: status === 'active' }), [status]);

    return { status, setStatus, search, setSearch, filters };
}
