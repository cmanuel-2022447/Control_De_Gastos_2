// Componente raiz de la aplicacion Angular
// Contenedor principal que carga los componentes segun las rutas definidas

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class App {
  title = 'Control de Gastos';
}