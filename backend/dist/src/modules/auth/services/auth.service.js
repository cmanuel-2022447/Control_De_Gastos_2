"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../../config/db");
const jwt_1 = require("../../../util/jwt");
class AuthService {
    static login(loginValue, passwordInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanLogin = loginValue === null || loginValue === void 0 ? void 0 : loginValue.trim();
            const cleanPassword = passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.trim();
            if (!cleanLogin || !cleanPassword) {
                throw new Error('INVALID_CREDENTIALS');
            }
            const result = yield db_1.pool.query(`SELECT id, usuario, correo, password, rol
             FROM public.usuarios
             WHERE LOWER(correo) = LOWER($1) OR LOWER(usuario) = LOWER($1)
             LIMIT 1`, [cleanLogin]);
            const user = result.rows[0];
            // Esta comparación es intencionalmente costosa para proteger contra ataques de fuerza bruta.
            // No se elimina porque es la parte que valida la contraseña de forma segura.
            if (!user) {
                throw new Error('INVALID_CREDENTIALS');
            }
            const passwordMatch = yield bcryptjs_1.default.compare(cleanPassword, user.password);
            if (!passwordMatch) {
                throw new Error('INVALID_CREDENTIALS');
            }
            const token = (0, jwt_1.generateToken)({
                id: user.id,
                usuario: user.usuario,
                email: user.correo,
                rol: user.rol
            });
            return {
                token,
                rol: user.rol
            };
        });
    }
    static register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const usuario = (_a = userData === null || userData === void 0 ? void 0 : userData.usuario) === null || _a === void 0 ? void 0 : _a.trim();
            const correo = (_b = userData === null || userData === void 0 ? void 0 : userData.correo) === null || _b === void 0 ? void 0 : _b.trim();
            const password = (_c = userData === null || userData === void 0 ? void 0 : userData.password) === null || _c === void 0 ? void 0 : _c.trim();
            const rol = ((_d = userData === null || userData === void 0 ? void 0 : userData.rol) === null || _d === void 0 ? void 0 : _d.trim()) || 'USUARIO';
            if (!usuario || !correo || !password) {
                throw new Error('INVALID_REGISTER_DATA');
            }
            const existingUser = yield db_1.pool.query(`SELECT id FROM public.usuarios WHERE LOWER(usuario) = LOWER($1) OR LOWER(correo) = LOWER($2) LIMIT 1`, [usuario, correo]);
            if (existingUser.rows.length > 0) {
                throw new Error('USER_ALREADY_EXISTS');
            }
            const passwordHash = yield bcryptjs_1.default.hash(password, 10);
            yield db_1.pool.query(`INSERT INTO public.usuarios (usuario, correo, password, rol) VALUES ($1, $2, $3, $4)`, [usuario, correo, passwordHash, rol]);
            return { message: 'Usuario registrado correctamente' };
        });
    }
}
exports.AuthService = AuthService;
