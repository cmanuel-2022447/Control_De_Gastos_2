// Componente raiz de la aplicacion Angular
// Contenedor principal que carga los componentes segun las rutas definidas

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>

    <div *ngIf="authService.sessionExpiredNotice()" class="session-notice-backdrop" role="alert" aria-live="assertive">
      <div class="session-notice">
        <div class="session-notice-icon">!</div>
        <div class="session-notice-content">
          <div class="session-notice-kicker">Sesión</div>
          <h2>Expirada</h2>
          <p>{{ authService.sessionExpiredNotice() }}</p>
          <button type="button" (click)="aceptarAvisoSesion()">Entendido <span>→</span></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-notice-backdrop { position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(11, 37, 69, .58); }
    .session-notice { display: flex; align-items: flex-start; gap: 16px; width: min(100%, 420px); border: 1px solid #b8cde2; border-radius: 18px; padding: 24px; color: #334155; background: #fff; box-shadow: 0 24px 60px rgba(11, 37, 69, .3); animation: notice-rise .25s ease-out both; }
    .session-notice-icon { display: grid; place-items: center; flex: 0 0 38px; width: 38px; height: 38px; border-radius: 50%; color: #fff; background: #1d5f9e; font-family: Georgia, serif; font-size: 1.35rem; font-weight: 800; }
    .session-notice-content { min-width: 0; flex: 1; }
    .session-notice-kicker { color: #64748b; font-size: .64rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
    .session-notice h2 { margin: 5px 0 7px; color: #134074; font-family: Georgia, serif; font-size: 1.55rem; font-weight: 400; }
    .session-notice p { margin: 0 0 18px; color: #64748b; font-size: .84rem; line-height: 1.45; }
    .session-notice button { border: 0; border-radius: 9px; padding: 10px 14px; color: #fff; background: #0b2545; cursor: pointer; font: inherit; font-size: .78rem; font-weight: 800; }
    .session-notice button:hover { background: #1d5f9e; }
    .session-notice button span { margin-left: 12px; font-size: 1rem; }
    @keyframes notice-rise { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @media (max-width: 480px) { .session-notice { padding: 20px; } }
  `]
})
export class App {
  title = 'Control de Gastos';

  constructor(public authService: AuthService) {}

  aceptarAvisoSesion(): void {
    this.authService.aceptarAvisoSesion();
  }
}