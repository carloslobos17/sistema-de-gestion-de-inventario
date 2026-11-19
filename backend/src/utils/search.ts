// src/utils/search.ts
// Búsqueda inteligente de los listados: decide CÓMO buscar según lo que escribió el usuario,
// para que MySQL use índices en vez de revisar la tabla completa.
//   - Solo números (DUI, NIT, NRC, teléfono) → "empieza con" en columnas con índice
//   - Trae "@"                               → correo que empieza con el texto
//   - Texto                                  → índice FULLTEXT (busca por palabras o comienzo de palabra)

export type SearchTerm =
    | { kind: 'digits'; digits: string }
    | { kind: 'email'; text: string }
    | { kind: 'text'; fullText: string | null; prefix: string };

// MySQL ignora en FULLTEXT las palabras de menos de 3 letras (innodb_ft_min_token_size)
const MIN_WORD_LENGTH = 3;

// Palabras que el FULLTEXT de InnoDB ignora por defecto (de 3 letras o más)
const FULLTEXT_STOPWORDS = new Set([
    'about', 'are', 'com', 'for', 'from', 'how', 'that', 'the', 'this',
    'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'www',
]);

const DIGITS_ONLY = /^[\d\s-]+$/;

// Convierte el texto en una búsqueda FULLTEXT en modo booleano: cada palabra es obligatoria
// y puede ser el comienzo de una palabra ("ferre" encuentra "Ferretería").
// Devuelve null si no queda ninguna palabra que el índice pueda usar.
export function buildFullTextQuery(text: string): string | null {
    const words = text
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u) // quita signos que FULLTEXT trata como operadores (+ - * " etc.)
        .filter((word) => word.length >= MIN_WORD_LENGTH && !FULLTEXT_STOPWORDS.has(word));

    return words.length > 0 ? words.map((word) => `+${word}*`).join(' ') : null;
}

export function parseSearchTerm(raw: string): SearchTerm {
    const text = raw.trim();
    const digits = text.replace(/\D/g, '');

    if (DIGITS_ONLY.test(text) && digits.length > 0) return { kind: 'digits', digits };
    if (text.includes('@')) return { kind: 'email', text: text.toLowerCase() };
    return { kind: 'text', fullText: buildFullTextQuery(text), prefix: text };
}

// Escapa % y _ para que el texto del usuario no funcione como comodín dentro de LIKE
export function escapeLike(text: string): string {
    return text.replace(/[\\%_]/g, (char) => `\\${char}`);
}

// Teléfono como lo guarda el sistema (####-####) a partir de los dígitos escritos
export function formatPhonePrefix(digits: string): string {
    return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
}
