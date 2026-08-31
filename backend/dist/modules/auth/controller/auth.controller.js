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
    // Metodo login: valida credenciales y genera token JWT
    // Entrada: email y password del usuario
    // Salida: token JWT y rol del usuario.
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Delegar validacion de credenciales al servicio
                const result = yield auth_service_1.AuthService.login(email, password);
                if (!result) {
                    return res.status(401).json({ message: "Correo o contraseña incorrectos" });
                }
                return res.status(200).json({
                    message: "Inicio de sesión exitoso",
                    token: result.token,
                    rol: result.rol
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Error interno en el servidor", error });
            }
        });
    }
}
exports.AuthController = AuthController;
