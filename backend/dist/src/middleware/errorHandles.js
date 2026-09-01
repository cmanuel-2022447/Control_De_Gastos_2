"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.errorHandler = errorHandler;
const jwt_1 = require("../util/jwt");
function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = (authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('Bearer '))
        ? authorization.slice('Bearer '.length)
        : undefined;
    if (!token) {
        res.status(401).json({
            message: 'Token requerido',
            code: 'NO_TOKEN'
        });
        return;
    }
    try {
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch (error) {
        // Distinguir entre token expirado e inválido
        if (error instanceof Error && error.name === 'TokenExpiredError') {
            res.status(401).json({
                message: 'El token ha expirado',
                code: 'TOKEN_EXPIRED'
            });
        }
        else if (error instanceof Error && error.message === 'Token invalido') {
            res.status(401).json({
                message: 'El token es inválido',
                code: 'TOKEN_INVALID'
            });
        }
        else {
            res.status(401).json({
                message: 'Error de autenticación',
                code: 'AUTH_ERROR'
            });
        }
    }
}
function errorHandler(error, _req, res, _next) {
    console.error(error);
    res.status(500).json({ message: 'Error interno en el servidor' });
}
