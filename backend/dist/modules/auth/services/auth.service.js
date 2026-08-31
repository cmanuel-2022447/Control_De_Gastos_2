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
const jwt_1 = require("../../../util/jwt");
// TODO: Conectar a PostgreSQL pool (ej. import { pool } from '../../../config/db');
// Usuarios de prueba con contraseñas hasheadas usando bcryptjs
// En producción, estos datos vendrían de la base de datos PostgreSQL
const USERS_DATABASE = [
    { id: 1, email: 'admin@kinal.com', passwordHash: '$2b$10$qvrUqapGl/2Cwl02oabIyuJOw9Z0uWuBjzw8nPz4VPr7qglls6m7u', rol: 'admin' },
    { id: 2, email: 'usuario@kinal.com', passwordHash: '$2b$10$AoOsZA4OoX1zGh4Mvpnuy.oOq19ZMt/iizlE8MH1u55n0/RprDqoK', rol: 'user' }
];
class AuthService {
    // Hashea una contraseña usando bcryptjs con salt rounds de 10
    // Retorna el hash seguro para almacenar en base de datos
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            return yield bcryptjs_1.default.hash(password, saltRounds);
        });
    }
    // Compara una contraseña en texto plano con su hash
    // Retorna true si coinciden, false si no
    static comparePassword(password, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, passwordHash);
        });
    }
    // Valida email y password contra credenciales registradas
    // Usa bcryptjs para comparar contraseñas de forma segura
    // Genera JWT con vencimiento de 5 horas
    // Retorna token y rol del usuario o null si fallan credenciales
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // NOTA: En producción, reemplazar con consulta real a PostgreSQL
                // const query = 'SELECT * FROM usuarios WHERE email = $1';
                // const result = await pool.query(query, [email]);
                // const user = result.rows[0];
                // Buscar usuario en base de datos temporal
                const user = USERS_DATABASE.find(u => u.email === email);
                if (!user) {
                    return null; // Usuario no existe
                }
                // Comparar contraseña usando bcryptjs de forma segura
                const isPasswordValid = yield this.comparePassword(password, user.passwordHash);
                if (!isPasswordValid) {
                    return null; // Contraseña incorrecta
                }
                // Generar JWT con datos del usuario
                const userPayload = { id: user.id, email: user.email, rol: user.rol };
                const token = (0, jwt_1.generateToken)(userPayload);
                return { token, rol: user.rol };
            }
            catch (error) {
                throw new Error("Error al autenticar con la base de datos");
            }
        });
    }
}
exports.AuthService = AuthService;
