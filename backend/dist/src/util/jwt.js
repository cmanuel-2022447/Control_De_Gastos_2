"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || '5m';
function generateToken(payload) {
    const options = { expiresIn: TOKEN_EXPIRATION };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.id || !decoded.usuario || !decoded.email || !decoded.rol) {
        throw new Error('Token invalido');
    }
    return decoded;
}
