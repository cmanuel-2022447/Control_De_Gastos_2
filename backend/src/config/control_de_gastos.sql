DROP TABLE IF EXISTS ingresos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'USUARIO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingresos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    original VARCHAR(50) NOT NULL,
    conversion VARCHAR(50) NOT NULL
);

-- Passwords válidos para el seed: admin123 y usuario123
INSERT INTO usuarios (usuario, correo, password, rol)
VALUES
('admin', 'admin@kinal.com', '$2b$10$ORZGZJi7qiND8bGK9nOyGeJJO.3ypBWV59tXzBmmDNPFtv5.6wEQe', 'ADMIN'),
('user', 'usuario@kinal.com', '$2b$10$M7o5GclFd68GXBtNZfqh8uQAliLnBKTelZYuOBfZa0MM9HHiQW42K', 'USUARIO');

SELECT * FROM usuarios;
SELECT * FROM ingresos;