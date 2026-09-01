import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { login, usuario, correo, email, identifier, username, password } = req.body;
            const loginValue = login || usuario || correo || email || identifier || username;

            if (!loginValue || !password) {
                return res.status(400).json({ message: "Faltan datos en la solicitud (usuario o contraseña vacíos)" });
            }

            const result = await AuthService.login(loginValue, password);
            return res.status(200).json({ message: "Inicio de sesión exitoso", token: result.token, rol: result.rol });
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
                return res.status(401).json({ message: "Correo, usuario o contraseña incorrectos" });
            }
            return res.status(503).json({ message: "La base de datos no está disponible" });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const { usuario, correo, email, password, rol } = req.body;
            const cleanUsuario = usuario || req.body.username || req.body.user;
            const cleanCorreo = correo || email;

            if (!cleanUsuario || !cleanCorreo || !password) {
                return res.status(400).json({ message: "Faltan datos para registrar el usuario" });
            }

            const result = await AuthService.register({
                usuario: cleanUsuario,
                correo: cleanCorreo,
                password,
                rol
            });

            return res.status(201).json({ message: result.message });
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_REGISTER_DATA') {
                return res.status(400).json({ message: "Faltan datos para registrar el usuario" });
            }

            if (error instanceof Error && error.message === 'USER_ALREADY_EXISTS') {
                return res.status(409).json({ message: "El usuario o correo ya existe" });
            }

            return res.status(503).json({ message: "La base de datos no está disponible" });
        }
    }
}