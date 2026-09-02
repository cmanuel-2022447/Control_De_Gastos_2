import bcryptjs from 'bcryptjs';
import { pool } from '../../../config/db';
import { generateToken } from '../../../util/jwt';

export class AuthService {
    static async login(loginValue: string, passwordInput: string): Promise<{ token: string; rol: string }> {
        const cleanLogin = loginValue?.trim();
        const cleanPassword = passwordInput?.trim();

        if (!cleanLogin || !cleanPassword) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const lookupValue = cleanLogin.toLowerCase();
        const userQuery = cleanLogin.includes('@')
            ? `SELECT id, usuario, correo, password, rol
               FROM public.usuarios
               WHERE LOWER(correo) = $1
               LIMIT 1`
            : `SELECT id, usuario, correo, password, rol
               FROM public.usuarios
               WHERE LOWER(usuario) = $1
               LIMIT 1`;

        const result = await pool.query(userQuery, [lookupValue]);
        const user = result.rows[0];

        // El costo de bcrypt.compare es deliberado: hace que la validación de contraseña sea
        // segura frente a ataques de fuerza bruta. Este tiempo no se debe eliminar ni ocultar,
        // pero sí se puede reducir el costo de la búsqueda previa con consultas más eficientes.

        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const passwordMatch = await bcryptjs.compare(cleanPassword, user.password);

        if (!passwordMatch) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const token = generateToken({
            id: user.id,
            usuario: user.usuario,
            email: user.correo,
            rol: user.rol
        });

        return {
            token,
            rol: user.rol
        };
    }

    static async register(userData: { usuario: string; correo: string; password: string; rol?: string }): Promise<{ message: string }> {
        const usuario = userData?.usuario?.trim();
        const correo = userData?.correo?.trim();
        const password = userData?.password?.trim();
        const rol = userData?.rol?.trim() || 'USUARIO';

        if (!usuario || !correo || !password) {
            throw new Error('INVALID_REGISTER_DATA');
        }

        const existingUser = await pool.query(
            `SELECT id FROM public.usuarios WHERE LOWER(usuario) = LOWER($1) OR LOWER(correo) = LOWER($2) LIMIT 1`,
            [usuario, correo]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        await pool.query(
            `INSERT INTO public.usuarios (usuario, correo, password, rol) VALUES ($1, $2, $3, $4)`,
            [usuario, correo, passwordHash, rol]
        );

        return { message: 'Usuario registrado correctamente' };
    }
}