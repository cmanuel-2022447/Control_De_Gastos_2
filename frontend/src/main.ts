// Punto de entrada de la aplicación Angular (lado cliente)
// Bootstrapea la aplicación con la configuración definida en app.config

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
