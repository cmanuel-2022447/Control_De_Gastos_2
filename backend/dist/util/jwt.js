"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const TOKEN_EXPIRATION = '5h';
function generateToken(payload) {
    const options = { expiresIn: TOKEN_EXPIRATION };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.id || !decoded.email || !decoded.rol) {
        throw new Error('Token invalido');
    }
    return decoded;
}
