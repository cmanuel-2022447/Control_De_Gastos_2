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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, usuario, correo, email, identifier, username, password } = req.body;
                const loginValue = login || usuario || correo || email || identifier || username;
                if (!loginValue || !password) {
                    return res.status(400).json({ message: "Faltan datos en la solicitud (usuario o contraseña vacíos)" });
                }
                const result = yield auth_service_1.AuthService.login(loginValue, password);
                return res.status(200).json({ message: "Inicio de sesión exitoso", token: result.token, rol: result.rol });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
                    return res.status(401).json({ message: "Correo, usuario o contraseña incorrectos" });
                }
                return res.status(503).json({ message: "La base de datos no está disponible" });
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario, correo, email, password, rol } = req.body;
                const cleanUsuario = usuario || req.body.username || req.body.user;
                const cleanCorreo = correo || email;
                if (!cleanUsuario || !cleanCorreo || !password) {
                    return res.status(400).json({ message: "Faltan datos para registrar el usuario" });
                }
                const result = yield auth_service_1.AuthService.register({
                    usuario: cleanUsuario,
                    correo: cleanCorreo,
                    password,
                    rol
                });
                return res.status(201).json({ message: result.message });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'INVALID_REGISTER_DATA') {
                    return res.status(400).json({ message: "Faltan datos para registrar el usuario" });
                }
                if (error instanceof Error && error.message === 'USER_ALREADY_EXISTS') {
                    return res.status(409).json({ message: "El usuario o correo ya existe" });
                }
                return res.status(503).json({ message: "La base de datos no está disponible" });
            }
        });
    }
}
exports.AuthController = AuthController;
