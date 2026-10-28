// src/features/locations/components/LocationSelect.tsx
// Departamento → Municipio → Distrito en cascada (catálogos de Hacienda).
// Al cambiar un nivel se limpian los de abajo. Los datos vienen de useLocations (una sola petición por sesión).
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { useLocations } from "../hooks/useLocations";
import type { LocationSelectProps } from "../model/locations.types";

export function LocationSelect({ idPrefix, value, onChange, error, disabled = false, required = false }: LocationSelectProps) {
    const { departments, isLoading, error: loadError, getMunicipalities, getDistricts } = useLocations();

    const municipalities = getMunicipalities(value.department_code || undefined);
    const districts = getDistricts(value.department_code || undefined, Number(value.municipality_id) || undefined);

    const isDisabled = disabled || isLoading;
    const errorId = `${idPrefix}-location-error`;
    const message = loadError ?? error;

    return (
        <>
            <div>
                <Label htmlFor={`${idPrefix}-department`} required={required}>
                    Departamento
                </Label>
                <Select
                    id={`${idPrefix}-department`}
                    placeholder={isLoading ? "Cargando..." : "Seleccione..."}
                    value={value.department_code}
                    onChange={(e) => onChange({ department_code: e.target.value, municipality_id: "", district_id: "" })}
                    disabled={isDisabled}
                    hasError={!!message && !value.department_code}
                    aria-describedby={message ? errorId : undefined}
                >
                    {departments.map((department) => (
                        <option key={department.code} value={department.code}>
                            {department.name}
                        </option>
                    ))}
                </Select>
            </div>

            <div>
                <Label htmlFor={`${idPrefix}-municipality`} required={required}>
                    Municipio
                </Label>
                <Select
                    id={`${idPrefix}-municipality`}
                    placeholder={value.department_code ? "Seleccione..." : "Elija primero el departamento"}
                    value={value.municipality_id}
                    onChange={(e) => onChange({ ...value, municipality_id: e.target.value, district_id: "" })}
                    disabled={isDisabled || !value.department_code}
                    hasError={!!message && !!value.department_code && !value.municipality_id}
                    aria-describedby={message ? errorId : undefined}
                >
                    {municipalities.map((municipality) => (
                        <option key={municipality.id} value={municipality.id}>
                            {municipality.name}
                        </option>
                    ))}
                </Select>
            </div>

            <div>
                <Label htmlFor={`${idPrefix}-district`} required={required}>
                    Distrito
                </Label>
                <Select
                    id={`${idPrefix}-district`}
                    placeholder={value.municipality_id ? "Seleccione..." : "Elija primero el municipio"}
                    value={value.district_id}
                    onChange={(e) => onChange({ ...value, district_id: e.target.value })}
                    disabled={isDisabled || !value.municipality_id}
                    hasError={!!message && !!value.municipality_id && !value.district_id}
                    aria-describedby={message ? errorId : undefined}
                >
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.name}
                        </option>
                    ))}
                </Select>
                <ErrorMessage id={errorId} message={message ?? undefined} />
            </div>
        </>
    );
}
