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
exports.pool = void 0;
exports.initializeDatabase = initializeDatabase;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
});
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.pool.query(`
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
        yield exports.pool.query(`
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
        yield exports.pool.query(`
        ALTER TABLE public.usuarios
            ADD COLUMN IF NOT EXISTS nombre VARCHAR(100) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS apellido VARCHAR(100) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS correo VARCHAR(100),
            ADD COLUMN IF NOT EXISTS genero VARCHAR(30) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
        yield exports.pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_idx ON public.usuarios (usuario)');
        yield exports.pool.query('CREATE UNIQUE INDEX IF NOT EXISTS usuarios_correo_idx ON public.usuarios (correo)');
    });
}
