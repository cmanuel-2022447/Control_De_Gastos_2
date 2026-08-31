import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token && !req.url.endsWith('/login')) {
        authService.logout();
        
        // Disparamos un diálogo visual amigable en lugar de un error técnico
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
            <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 10px;">Tu sesión ha expirado</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">El tiempo de inicio de sesión terminó por seguridad. Vuelve a iniciar sesión para continuar.</p>
              <button id="btn-relogin" style="background: #134074; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Iniciar sesión nuevamente</button>
            </div>
          </div>
        `;
        document.body.appendChild(modalContainer);

        document.getElementById('btn-relogin')?.addEventListener('click', () => {
          document.body.removeChild(modalContainer);
          router.navigate(['/login']);
        });
      }
      return throwError(() => error);
    })
  );
};