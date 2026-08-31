import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
});

export async function initializeDatabase(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            usuario VARCHAR(100) UNIQUE NOT NULL,
            correo VARCHAR(100) UNIQUE NOT NULL,
            genero VARCHAR(30) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            rol VARCHAR(50) DEFAULT 'USUARIO',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'email'
            ) AND NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'correo'
            ) THEN
                ALTER TABLE public.usuarios RENAME COLUMN email TO correo;
            END IF;
        END $$
    `);

    await pool.query(`
        ALTER TABLE public.usuarios
            ADD COLUMN IF NOT EXISTS nombre VARCHAR(100) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS apellido VARCHAR(100) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS correo VARCHAR(100),
            ADD COLUMN IF NOT EXISTS genero VARCHAR(30) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_idx ON public.usuarios (usuario)');
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_correo_idx ON public.usuarios (correo)');
}