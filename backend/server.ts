// Punto de entrada del servidor backend
// Inicia el servidor Express en el puerto especificado

import app from './app';
import { initializeDatabase } from './src/config/db';

const PORT = process.env.PORT || 3000;

// Iniciar servidor y escuchar en el puerto definido
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('No se pudo conectar a PostgreSQL. El servidor no se iniciara.', error.message);
        process.exit(1);
    });