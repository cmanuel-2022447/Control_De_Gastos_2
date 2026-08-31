import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../util/jwt';

export type AuthenticatedRequest = Request & {
    user?: ReturnType<typeof verifyToken>;
};

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : undefined;

    if (!token) {
        res.status(401).json({ message: 'Token requerido' });
        return;
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        const message = error instanceof Error && error.name === 'TokenExpiredError'
            ? 'El token expiro'
            : 'Token invalido';
        res.status(401).json({ message });
    }
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
    console.error(error);
    res.status(500).json({ message: 'Error interno en el servidor' });
}