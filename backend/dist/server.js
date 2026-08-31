"use strict";
// Punto de entrada del servidor backend
// Inicia el servidor Express en el puerto especificado
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./src/config/db");
const PORT = process.env.PORT || 3000;
// Iniciar servidor y escuchar en el puerto definido
(0, db_1.initializeDatabase)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
})
    .catch((error) => {
    console.error('No se pudo conectar a PostgreSQL. El servidor no se iniciara.', error.message);
    process.exit(1);
});
