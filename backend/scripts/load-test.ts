// scripts/load-test.ts
// Prueba de carga: muchos usuarios a la vez listando y buscando clientes y proveedores.
// Hace login UNA vez y usa ese token en todas las peticiones (el login es lento a propósito por bcrypt).
// Uso:  npm run load-test                 (backend corriendo en otra terminal)
//       npm run load-test -- --duration=30 --connections=10,50,100,200
import 'dotenv/config';
import autocannon from 'autocannon';

const BASE_URL = process.env.LOAD_TEST_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api`;
const USERNAME = process.env.SEED_ADMIN_USERNAME ?? 'admin';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? '';

interface Scenario {
    name: string;
    paths: string[]; // si hay varias, autocannon las va rotando
}

// Búsquedas variadas para que MySQL no responda siempre lo mismo desde caché
const SCENARIOS: Scenario[] = [
    { name: 'Clientes: listado página 1', paths: ['/customers?page=1&limit=10'] },
    {
        name: 'Clientes: búsqueda por nombre',
        paths: ['lopez', 'maria jose', 'hernandez garcia', 'ferreteria', 'sa de cv'].map((term) => `/customers?search=${encodeURIComponent(term)}&page=1&limit=10`),
    },
    {
        name: 'Clientes: búsqueda por documento',
        paths: ['0614', '01234', '7123', '98765'].map((term) => `/customers?search=${term}&page=1&limit=10`),
    },
    { name: 'Clientes: página profunda (1000)', paths: ['/customers?page=1000&limit=10'] },
    {
        name: 'Proveedores: búsqueda por nombre',
        paths: ['distribuidora', 'materiales lopez', 'suministros'].map((term) => `/suppliers?search=${encodeURIComponent(term)}&page=1&limit=10`),
    },
];

function readArg(name: string): string | undefined {
    return process.argv.find((value) => value.startsWith(`--${name}=`))?.split('=')[1];
}

async function login(): Promise<string> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    });
    if (!response.ok) throw new Error(`No se pudo iniciar sesión (${response.status}). Revisa SEED_ADMIN_USERNAME y SEED_ADMIN_PASSWORD del .env.`);
    const body = (await response.json()) as { data: { accessToken: string } };
    return body.data.accessToken;
}

async function runScenario(scenario: Scenario, connections: number, duration: number, token: string) {
    const result = await autocannon({
        url: BASE_URL,
        connections,
        duration,
        headers: { Authorization: `Bearer ${token}` },
        requests: scenario.paths.map((path) => ({ method: 'GET' as const, path: `/api${path}` })),
    });

    return {
        Escenario: scenario.name,
        Usuarios: connections,
        'Pet/seg': Math.round(result.requests.average),
        'p50 (ms)': result.latency.p50,
        'p97.5 (ms)': result.latency.p97_5,
        'p99 (ms)': result.latency.p99,
        'Máx (ms)': result.latency.max,
        Errores: result.errors + result.timeouts + result.non2xx,
    };
}

async function main(): Promise<void> {
    if (process.env.NODE_ENV === 'production') throw new Error('No se corre una prueba de carga contra producción.');

    const duration = Number(readArg('duration') ?? 15);
    const levels = (readArg('connections') ?? '10,50,100').split(',').map(Number).filter((n) => n > 0);

    // El token dura 15 min: si la prueba es más larga, puede empezar a dar 401
    const estimatedMinutes = (SCENARIOS.length * levels.length * duration) / 60;
    console.log(`Prueba de carga contra ${BASE_URL} · ${SCENARIOS.length} escenarios × ${levels.length} niveles × ${duration} s ≈ ${estimatedMinutes.toFixed(1)} min`);
    if (estimatedMinutes > 14) console.warn('⚠ Dura más que el access token (15 min): baja --duration o los niveles.');

    const token = await login();
    const rows = [];

    for (const scenario of SCENARIOS) {
        for (const connections of levels) {
            process.stdout.write(`  ▶ ${scenario.name} con ${connections} usuarios...`);
            rows.push(await runScenario(scenario, connections, duration, token));
            console.log(' listo');
        }
    }

    console.log('\nResultados (pet/seg = peticiones por segundo; p97.5 = el 97.5 % tardó menos que esto):');
    console.table(rows);
}

main().catch((error) => {
    console.error('✖', error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
