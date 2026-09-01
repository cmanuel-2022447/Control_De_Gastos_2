import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AUTH GUARD
 * 
 * Protege rutas que requieren autenticación
 * 
 * FLUJO:
 * 1. Verifica si isLoggedIn() retorna true
 *    - Token existe
 *    - Token se puede decodificar
 *    - Token no está localmente expirado (claim exp)
 * 
 * 2. Si NO está autenticado:
 *    - Redirige a /login
 * 
 * 3. Si SÍ está autenticado:
 *    - Permite acceso a la ruta
 *    - PERO el backend aún validará el token en cada petición
 * 
 * SEGURIDAD:
 * - Este guard es para la UI (prevenir navegación a rutas protegidas)
 * - El verdadero control de acceso está en el backend
 * - Si el token expira después de que el guard lo validó,
 *   el backend rechazará la petición con 401
 * - El interceptor detectará el 401 y manejará la expiración
 * 
 * IMPORTANTE:
 * - NO confiar únicamente en este guard
 * - El backend debe validar SIEMPRE
 * - Este es solo un helper de UX
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
};