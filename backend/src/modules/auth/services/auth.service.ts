import bcryptjs from 'bcryptjs';
import { pool } from '../../../config/db';
import { generateToken } from '../../../util/jwt';

export class AuthService {
    static async login(loginValue: string, password: string): Promise<{ token: string; rol: string }> {
        const result = await pool.query(
            'SELECT id, usuario, correo, password_hash, rol FROM public.usuarios WHERE correo = $1 OR usuario = $1 LIMIT 1',
            [loginValue]
        );
        const user = result.rows[0];

        if (!user || !(await bcryptjs.compare(password, user.password_hash))) {
            throw new Error('INVALID_CREDENTIALS');
        }

        return {
            token: generateToken({ id: user.id, usuario: user.usuario, email: user.correo, rol: user.rol }),
            rol: user.rol
        };
    }

    static async register(
        nombre: string,
        apellido: string,
        usuario: string,
        correo: string,
        password: string,
        genero: string
    ): Promise<{ id: number; nombre: string; apellido: string; usuario: string; correo: string; genero: string }> {
        // Verificar si el usuario ya existe
        const existingUser = await pool.query(
            'SELECT id FROM public.usuarios WHERE usuario = $1 OR correo = $2 LIMIT 1',
            [usuario, correo]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('USER_EXISTS');
        }

        const saltRounds = 10;
        const password_hash = await bcryptjs.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO public.usuarios (nombre, apellido, usuario, correo, genero, password_hash, rol)
             VALUES ($1, $2, $3, $4, $5, $6, 'USUARIO')
             RETURNING id, nombre, apellido, usuario, correo, genero`,
            [nombre, apellido, usuario, correo, genero, password_hash]
        );

        return result.rows[0];
    }
}