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
exports.pool = exports.databaseConfig = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
exports.initializeDatabase = initializeDatabase;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.databaseConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
};
exports.pool = new pg_1.Pool(exports.databaseConfig);
function testDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield exports.pool.connect();
        try {
            yield client.query('SELECT NOW()');
        }
        finally {
            client.release();
        }
    });
}
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.pool.query(`
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
        yield exports.pool.query(`
        ALTER TABLE IF EXISTS public.ingresos
        DROP COLUMN IF EXISTS created_at;
    `);
    });
}
