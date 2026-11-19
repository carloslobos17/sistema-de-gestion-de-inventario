// src/features/auth/components/IdleSessionWatcher.tsx
// Activa la vigilancia de inactividad en las páginas con sesión y muestra el aviso cuando toca.
import { useIdleSession } from '../hooks/useIdleSession';
import { useLogout } from '../hooks/useLogout';
import { IdleWarningDialog } from './IdleWarningDialog';

export function IdleSessionWatcher() {
    const { secondsLeft, stayActive } = useIdleSession();
    const logout = useLogout();

    if (secondsLeft === null) return null;

    return <IdleWarningDialog secondsLeft={secondsLeft} onStay={stayActive} onLogout={() => void logout()} />;
}
