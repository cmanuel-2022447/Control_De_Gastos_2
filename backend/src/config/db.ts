import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const databaseConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
};

export const pool = new Pool(databaseConfig);

export async function testDatabaseConnection(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('SELECT NOW()');
    } finally {
        client.release();
    }
}

export async function initializeDatabase(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            usuario VARCHAR(100) NOT NULL UNIQUE,
            correo VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            rol VARCHAR(50) DEFAULT 'USUARIO',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS ingresos (
            id SERIAL PRIMARY KEY,
            fecha DATE NOT NULL,
            descripcion VARCHAR(255) NOT NULL,
            lugar VARCHAR(255) NOT NULL,
            original VARCHAR(50) NOT NULL,
            conversion VARCHAR(50) NOT NULL
        );
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_usuarios_correo_lower
        ON public.usuarios ((LOWER(correo)));
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_usuarios_usuario_lower
        ON public.usuarios ((LOWER(usuario)));
    `);

    await pool.query(`
        ALTER TABLE IF EXISTS public.ingresos
        DROP COLUMN IF EXISTS created_at;
    `);
} 