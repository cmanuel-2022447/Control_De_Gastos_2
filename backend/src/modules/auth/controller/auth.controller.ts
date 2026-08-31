import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { login, password } = req.body;
            const result = await AuthService.login(login, password);
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
            const { nombre, apellido, usuario, correo, email, password, genero } = req.body;
            const correoUsuario = correo || email;

            if (!nombre || !apellido || !usuario || !correoUsuario || !password || !genero) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            const newUser = await AuthService.register(
                nombre,
                apellido,
                usuario,
                correoUsuario,
                password,
                genero
            );
            return res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
        } catch (error) {
            if (error instanceof Error && error.message === 'USER_EXISTS') {
                return res.status(409).json({ message: "El usuario o correo electrónico ya están registrados" });
            }
            return res.status(500).json({ message: "Error interno al registrar usuario" });
        }
    }
}