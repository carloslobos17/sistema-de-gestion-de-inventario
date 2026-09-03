import { useHealthCheck } from './features/health/hooks/useHealthCheck';

export default function App() {
    const { data, loading, error, testConnection } = useHealthCheck();

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl max-w-md w-full text-center">
        <span className="inline-block bg-emerald-500/20 text-emerald-400 font-medium text-xs px-3 py-1 rounded-full mb-4">
          Arquitectura Modular Activa
        </span>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                    Constru-Industrias Martínez
                </h1>
                <p className="text-slate-400 text-sm mb-6">
                    Peticiones de red separadas en hooks y servicios.
                </p>

                <button
                    onClick={testConnection}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                >
                    {loading ? 'Consultando API...' : 'Probar Conexión'}
                </button>

                {data && (
                    <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-left text-xs text-emerald-300">
                        <p><strong>Estado:</strong> {data.status}</p>
                        <p><strong>Mensaje:</strong> {data.message}</p>
                        <p><strong>Hora:</strong> {new Date(data.timestamp).toLocaleTimeString()}</p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-left text-xs text-rose-300">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}