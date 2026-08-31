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
                const { login, password } = req.body;
                const result = yield auth_service_1.AuthService.login(login, password);
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
                const { nombre, apellido, usuario, correo, email, password, genero } = req.body;
                const correoUsuario = correo || email;
                if (!nombre || !apellido || !usuario || !correoUsuario || !password || !genero) {
                    return res.status(400).json({ message: "Todos los campos son obligatorios" });
                }
                const newUser = yield auth_service_1.AuthService.register(nombre, apellido, usuario, correoUsuario, password, genero);
                return res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'USER_EXISTS') {
                    return res.status(409).json({ message: "El usuario o correo electrónico ya están registrados" });
                }
                return res.status(500).json({ message: "Error interno al registrar usuario" });
            }
        });
    }
}
exports.AuthController = AuthController;
