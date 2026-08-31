# Control de Gastos

Sistema de gestión de gastos personales con arquitectura moderna, construido con TypeScript, Angular, pgAdmin y Node.js.

## Descripción

Control de Gastos es una aplicación web que permite a los usuarios registrar, categorizar y monitorear sus gastos de forma fácil e intuitiva. La aplicación proporcionara herramientas para visualizar y analizar patrones de gasto con una interfaz moderna y responsiva.

## Tecnologías Utilizadas

### Backend
- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework**: Express.js (inferido por la estructura)
- **Gestor de paquetes**: pnpm
- **Arquitectura**: Modular (MVC - Model View Controller)

### Frontend
- **Framework**: Angular (versión moderna con standalone components)
- **Lenguaje**: TypeScript
- **Herramientas de build**: Angular CLI
- **Gestor de paquetes**: pnpm
- **Características**: 
  - Server-Side Rendering (SSR) habilitado
  - Componentes standalone
  - Routing avanzado

### DevOps & Configuración
- **Control de versiones**: Git
- **Workspace**: pnpm workspace monorepo
- **Configuración**: TypeScript strict mode

## Estructura del Proyecto

```
control_de_gastos/
├── backend/                          # Servidor Node.js con Express
│   ├── src/
│   │   └── modules/
│   │       ├── auth/                 # Módulo de autenticación
│   │       │   ├── controller/
│   │       │   ├── services/
│   │       │   └── routes/
│   │       └── expensive/            # Módulo de gastos
│   │           ├── controller/
│   │           ├── model/
│   │           ├── services/
│   │           └── routes/
│   ├── app.ts                        # Configuración de la aplicación
│   ├── server.ts                     # Punto de entrada del servidor
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                         # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts                # Componente principal
│   │   │   ├── app.routes.ts         # Rutas de la aplicación
│   │   │   ├── app.config.ts         # Configuración de Angular
│   │   │   ├── app.config.server.ts  # Configuración SSR
│   │   │   ├── login.component.ts    # Componente de login
│   │   │   └── bienvenida.component.ts
│   │   ├── main.ts                   # Punto de entrada client-side
│   │   ├── main.server.ts            # Punto de entrada server-side
│   │   ├── styles.css                # Estilos globales
│   │   └── index.html
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
└── README.md                         # Este archivo
```

## Primeros Pasos

### Requisitos Previos
- Node.js (v18 o superior)
- pnpm (gestor de paquetes)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd control_de_gastos
```

2. **Instalar dependencias**
```bash
# Instalar todas las dependencias del workspace
pnpm install
```

### Desarrollo

#### Backend
```bash
cd backend
pnpm run dev
# El servidor iniciará en http://localhost:3000 (por defecto)
```

#### Frontend
```bash
cd frontend
pnpm start
# La aplicación estará disponible en http://localhost:4200
```

### Build para Producción

#### Backend
```bash
cd backend
pnpm run build
pnpm start
```

#### Frontend
```bash
cd frontend
pnpm run build
# Los archivos compilados estarán en dist/
```

## Módulos Principales

### Autenticación (auth)
Responsable de autenticacion y manejo de credenciales.

**Ubicacion**: `backend/src/modules/auth/`

Componentes:
- **controller/auth.controller.ts**: Maneja peticiones HTTP POST /login
  - Recibe email y password
  - Delega validacion al servicio
  - Retorna token JWT

- **services/auth.service.ts**: Logica de autenticacion
  - Valida credenciales contra base de datos
  - Requiere una conexión activa a PostgreSQL

- **routes/auth.routes.ts**: Definicion de endpoints
  - POST /api/auth/login - Autentica usuario

## Componentes Frontend

### Componente Raiz (app.ts)
- Contenedor principal
- Carga router outlet
- Rutas distribuyen a componentes segun path

### Componente Login (login.component.ts)
- Interfaz de autenticacion
- Recibe email y password
- Valida con backend
  - Permite ingresar credenciales registradas en PostgreSQL
- Genera sesion con token JWT
- Ruta: `/` (raiz)

### Componente Bienvenida (bienvenida.component.ts)
- Dashboard principal
- Mostrado despues de login exitoso
- Sidebar con menu de navegacion
- Contenido principal con panel de control
- Boton logout
- Ruta: `/bienvenidos`

### Configuracion de Rutas (app.routes.ts)
```
/ -> LoginComponent
/bienvenidos -> BienvenidaComponent
```

## Flujo de Autenticacion

1. Usuario accede a la aplicacion (ruta /)
2. Se carga LoginComponent
3. Usuario ingresa email y password
4. Frontend envia POST /api/auth/login
5. Backend valida credenciales en AuthService
6. Backend genera JWT
7. Backend retorna token
8. Frontend almacena token en sesion
9. Frontend redirige a /bienvenidos
10. Se carga BienvenidaComponent con datos del usuario