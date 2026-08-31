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
    static login(loginValue, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.pool.query('SELECT id, usuario, correo, password_hash, rol FROM public.usuarios WHERE correo = $1 OR usuario = $1 LIMIT 1', [loginValue]);
            const user = result.rows[0];
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password_hash))) {
                throw new Error('INVALID_CREDENTIALS');
            }
            return {
                token: (0, jwt_1.generateToken)({ id: user.id, usuario: user.usuario, email: user.correo, rol: user.rol }),
                rol: user.rol
            };
        });
    }
    static register(nombre, apellido, usuario, correo, password, genero) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si el usuario ya existe
            const existingUser = yield db_1.pool.query('SELECT id FROM public.usuarios WHERE usuario = $1 OR correo = $2 LIMIT 1', [usuario, correo]);
            if (existingUser.rows.length > 0) {
                throw new Error('USER_EXISTS');
            }
            const saltRounds = 10;
            const password_hash = yield bcryptjs_1.default.hash(password, saltRounds);
            const result = yield db_1.pool.query(`INSERT INTO public.usuarios (nombre, apellido, usuario, correo, genero, password_hash, rol)
             VALUES ($1, $2, $3, $4, $5, $6, 'USUARIO')
             RETURNING id, nombre, apellido, usuario, correo, genero`, [nombre, apellido, usuario, correo, genero, password_hash]);
            return result.rows[0];
        });
    }
}
exports.AuthService = AuthService;
