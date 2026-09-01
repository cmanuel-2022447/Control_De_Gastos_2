# Control de Gastos

Aplicación para gestionar ingresos, gastos y presupuesto personal con una estructura modular en Node.js + Express y Angular.

## Descripción

Control de Gastos permite registrar movimientos financieros, consultar métricas del resumen del día, visualizar presupuestos y administrar la sesión del usuario. La aplicación se ha ido reforzando con una capa de autenticación JWT más robusta y con ajustes visuales del dashboard para mejorar la experiencia general.

## Stack actual

### Backend
- Node.js
- TypeScript
- Express
- PostgreSQL
- JWT para autenticación
- pnpm como gestor de paquetes

### Frontend
- Angular con componentes standalone
- TypeScript
- Routing y guards
- Servicios reactivos para autenticación y sesión
- Estilos personalizados para dashboard y shell global

## Estructura del proyecto

```bash
control_de_gastos/
├── backend/
│   ├── app.ts
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/
│       │   ├── auth/
│       │   ├── expensive/
│       │   ├── ingresos/
│       │   └── ...
│       └── util/
│
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── index.html
│       └── main.ts
│
├── README.md
```

## Módulos principales

### Backend
- auth: login, registro y manejo del token JWT.
- ingresos: gestión de ingresos del usuario.
- expensive: gestión de gastos.
- middleware: validación de autenticación y control de errores.
- util/jwt.ts: lógica para generar y verificar tokens.

### Frontend
- app-shell: layout global con sidebar, branding y navegación compartida.
- dashboard: resumen financiero principal.
- login: autenticación del usuario.
- register: creación de cuentas.
- perfil: datos del usuario.
- configuraciones: ajustes visuales y de apariencia.

## Flujo de autenticación actual

1. El usuario ingresa sus credenciales.
2. El backend valida las credenciales.
3. Se genera un JWT con expiración.
4. El frontend guarda el token para las peticiones futuras.
5. Cuando el backend responde 401, el frontend reacciona de forma controlada.
6. La expiración local se usa solo para UX y anticipación visual.
7. La autoridad final sigue estando en el backend.
8. En logout manual, se limpia la sesión y se redirige a login sin mostrar la alerta de expiración.

## Variables de entorno

El backend usa variables de entorno, incluyendo la secret y el tiempo de expiración JWT. Es importante mantener ambas configuradas correctamente para que la sesión funcione con tiempos cortos o largos.

Ejemplo conceptual:

```env
JWT_SECRET=tu_secret
JWT_EXPIRES_IN=1h
```

## Instalación

### Requisitos
- Node.js
- pnpm
- PostgreSQL

### Dependencias
```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

### Ejecutar backend
```bash
cd backend
pnpm run dev
```

### Ejecutar frontend
```bash
cd frontend
pnpm start
```

## Notas importantes

- La validación real del JWT se hace en el backend.
- El frontend no debe ser la fuente de verdad para autenticación.
- Los ajustes visuales de layout y dashboard no cambian la lógica del negocio ni la seguridad.
- El branding del sidebar y el dashboard se han mejorado para una experiencia más clara y moderna.

## Estado actual

El proyecto se encuentra en una versión funcional con autenticación JWT reforzada, dashboard visualmente mejorado y flujo de logout más limpio para la experiencia del usuario.