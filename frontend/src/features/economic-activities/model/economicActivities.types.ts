// src/features/economic-activities/model/economicActivities.types.ts
// Catálogo de actividades económicas de Hacienda (CAT-019). Solo lectura.

export interface EconomicActivity {
    code: string; // 5 dígitos, ej. "47522"
    name: string;
}

// Props de <EconomicActivitySelect>: selector con buscador (son 773 actividades)
export interface EconomicActivitySelectProps {
    id: string;
    value: string; // código elegido ("" = ninguno)
    onChange: (code: string) => void;
    hasError?: boolean;
    disabled?: boolean;
    describedBy?: string;
}
