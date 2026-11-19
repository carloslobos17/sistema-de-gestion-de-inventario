// src/modules/auth/auth.cookie.ts
// Opciones de la cookie del refresh token en un solo lugar (crearla y borrarla deben usar las mismas).
import type { CookieOptions, Request, Response } from 'express';

export const REFRESH_COOKIE_NAME = 'refresh_token';

// La cookie solo viaja a /api/auth (login, refresh y logout), no a cada petición
const COOKIE_PATH = '/api/auth';
const SAME_SITE_VALUES = ['strict', 'lax', 'none'] as const;
type SameSite = (typeof SAME_SITE_VALUES)[number];

function getBaseOptions(): CookieOptions {
    const secure = process.env.COOKIE_SECURE === 'true';
    const rawSameSite = process.env.COOKIE_SAMESITE ?? 'strict';

    if (!SAME_SITE_VALUES.includes(rawSameSite as SameSite)) {
        throw new Error('COOKIE_SAMESITE debe ser "strict", "lax" o "none"');
    }
    // Los navegadores rechazan SameSite=None sin Secure
    if (rawSameSite === 'none' && !secure) {
        throw new Error('COOKIE_SAMESITE="none" exige COOKIE_SECURE="true" (HTTPS)');
    }

    return { httpOnly: true, secure, sameSite: rawSameSite as SameSite, path: COOKIE_PATH };
}

export function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
    res.cookie(REFRESH_COOKIE_NAME, token, { ...getBaseOptions(), expires: expiresAt });
}

export function clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, getBaseOptions());
}

export function readRefreshCookie(req: Request): string | undefined {
    const value: unknown = req.cookies?.[REFRESH_COOKIE_NAME];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}
