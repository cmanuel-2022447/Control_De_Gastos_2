# Control de Gastos

Aplicación web para gestionar ingresos, gastos, presupuesto personal y autenticación de usuarios con una arquitectura full-stack en TypeScript.

## Descripción

Control de Gastos permite llevar un control financiero personal con:

- registro y autenticación de usuarios
- gestión de ingresos
- gestión de gastos
- resumen del estado financiero
- panel de administración visual
- seguridad basada en JWT

El proyecto está dividido en dos partes principales:

- Backend en Node.js + Express + TypeScript
- Frontend en Angular + TypeScript

---

## Tecnologías utilizadas

### Backend
- Node.js
- TypeScript
- Express
- PostgreSQL
- pg (cliente de PostgreSQL)
- JWT (jsonwebtoken)
- bcryptjs para encriptación de contraseñas
- dotenv para variables de entorno
- ts-node-dev para desarrollo

### Frontend
- Angular
- TypeScript
- Angular Router
- Angular HttpClient
- RxJS
- Angular Forms
- Standalone components

### Herramientas del proyecto
- pnpm como gestor de paquetes
- PostgreSQL como base de datos principal

---

## Estructura del proyecto

```bash
Control_De_Gastos/
├── backend/
│   ├── app.ts
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── pnpm-lock.yaml
│   └── src/
│       ├── config/
│       │   ├── db.ts
│       │   └── control_de_gastos.sql
│       ├── middleware/
│       ├── modules/
│       │   ├── auth/
│       │   ├── expensive/
│       │   └── ingresos/
│       └── util/
│           └── jwt.ts
│
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── index.html
│       └── main.ts
│
├── README.md
└── repomix-output.xml
```

---

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener instalado lo siguiente:

- Node.js LTS (recomendado 18 o superior)
- pnpm
- PostgreSQL
- Git

Puedes verificar la instalación con:

```bash
node -v
pnpm -v
psql --version
```

---

## 1) Instalar PostgreSQL y preparar la base de datos

1. Instala PostgreSQL en tu equipo.
2. Crea una base de datos, por ejemplo:

```sql
CREATE DATABASE control_de_gastos;
```

3. Importa el script SQL del proyecto:

```bash
cd backend/src/config
psql -U postgres -d control_de_gastos -f control_de_gastos.sql
```

> Si tu usuario de PostgreSQL no es `postgres`, cambia el comando por tu usuario correspondiente.

El script crea las tablas `usuarios` e `ingresos` y además inserta usuarios de prueba.

---

## 2) Configurar variables de entorno del backend

Crea un archivo `.env` dentro de la carpeta `backend`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=control_de_gastos
JWT_SECRET=mi_clave_super_secreta
JWT_EXPIRES_IN=1h
```

Ajusta los valores según tu entorno local.

---

## 3) Instalar dependencias del backend

```bash
cd backend
pnpm install
```

---

## 4) Ejecutar el backend

```bash
cd backend
pnpm run dev
```

Esto levantará el servidor Express en:

```text
http://localhost:3000
```

---

## 5) Instalar dependencias del frontend

Desde la raíz del proyecto:

```bash
cd frontend
pnpm install
```

---

## 6) Ejecutar el frontend

```bash
cd frontend
pnpm start
```

Esto levantará Angular en:

```text
http://localhost:4200
```

---

## 7) Probar la aplicación

### Credenciales por defecto

El script SQL incluye usuarios de prueba:

- Usuario: `admin`
- Correo: `admin@kinal.com`
- Contraseña: `admin123`

- Usuario: `user`
- Correo: `usuario@kinal.com`
- Contraseña: `usuario123`

Puedes iniciar sesión con cualquiera de ellos desde la pantalla de login.

---

## Funcionalidades principales

- Login y registro de usuarios
- Validación de credenciales con JWT
- Persistencia en PostgreSQL
- Gestión de ingresos y egresos
- Dashboard financiero con métricas
- Sistema de sesión con protección de rutas

---

## Consideraciones importantes

- El backend es la fuente de verdad para autenticación y validación.
- El frontend solo consume la API y gestiona la experiencia del usuario.
- Mantén el archivo `.env` local y no lo compartas en repositorios públicos.
- Si cambias la base de datos, asegúrate de actualizar la configuración del `.env`.

---

## Comandos rápidos

### Backend
```bash
cd backend
pnpm install
pnpm run dev
```

### Frontend
```bash
cd frontend
pnpm install
pnpm start
```

---

## Estado del proyecto

El proyecto está configurado como una aplicación funcional de control financiero con autenticación, API REST y frontend Angular, listo para correr en un entorno local con PostgreSQL y pnpm.