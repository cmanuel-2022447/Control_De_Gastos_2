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
        res.status(401).json({ message: 'Token requerido' });
        return;
    }
    try {
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch (error) {
        const message = error instanceof Error && error.name === 'TokenExpiredError'
            ? 'El token expiro'
            : 'Token invalido';
        res.status(401).json({ message });
    }
}
function errorHandler(error, _req, res, _next) {
    console.error(error);
    res.status(500).json({ message: 'Error interno en el servidor' });
}
