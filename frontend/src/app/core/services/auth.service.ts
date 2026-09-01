import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * ServicioAutenticación JWT con manejo robusto de expiración
 * 
 * PRINCIPIOS DE SEGURIDAD:
 * 1. El BACKEND es la autoridad sobre validación de JWT
 * 2. El frontend reacciona a rechazos 401 del backend
 * 3. Solo UN logout se ejecuta cuando hay múltiples 401 simultáneos
 * 4. El token se almacena en localStorage
 * 5. La información de "exp" se usa solo para UX (predecir expiración)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  
  // Timer para cerrar sesión automáticamente ANTES de que expire
  // (esto es un hint del cliente, no es verificación de seguridad)
  private expirationTimer: ReturnType<typeof setTimeout> | undefined;
  
  // Flag para prevenir múltiples intentos simultáneos de cierre
  // CRÍTICO: Previene 10 peticiones 401 → 10 logout
  private sessionTerminationInProgress = false;
  
  // Signal para mostrar el aviso de sesión expirada
  readonly sessionExpiredNotice = signal('');

  constructor(private http: HttpClient, private router: Router) {
    this.inicializarSesion();
  }

  /**
   * LOGIN
   * Autentica al usuario y guarda el token recibido por el backend.
   * Una vez validado, se activa la lógica local de expiración para UX,
   * pero la seguridad real sigue estando en el servidor.
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol || 'USUARIO');
          // Programar logout automático ANTES de que expire
          this.programarCierreAutomatico();
        }
      })
    );
  }

  /**
   * REGISTER
   * Registra nuevo usuario
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * LOGOUT MANUAL
   * Este cierre se usa cuando el usuario decide cerrar sesión por su cuenta.
   * La intención es limpiar la sesión sin disparar la notificación de expiración.
   * El flujo real de navegación se maneja fuera del servicio.
   */
  logout(): void {
    this.sessionExpiredNotice.set('');
    this._terminarSesion('logout_manual', false);
  }

  /**
   * DETECTADO 401 DEL BACKEND
   * Se llama desde interceptor cuando backend rechaza token
   * DEDUPLICADO: Si ya hay una terminación en progreso, ignora nuevas llamadas
   */
  sesionRechazadaPorBackend(): void {
    if (this.sessionTerminationInProgress) {
      // Ya hay un cierre en progreso, ignorar esta llamada
      return;
    }

    this._terminarSesion('token_rechazado_backend');
  }

  /**
   * USUARIO ACEPTA AVISO
   * Se ejecuta cuando usuario presiona "Entendido" en el modal
   */
  aceptarAvisoSesion(): void {
    this.sessionExpiredNotice.set('');
    // Esperar a que Angular renderice la desaparición del modal
    // antes de navegar
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  /**
   * OBTENER TOKEN
   * Retorna el JWT del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * DECODIFICAR PAYLOAD DEL JWT
   * 
   * NOTA: Esto es SOLO para leer información local
   * NO se usa para validar seguridad
   * El BACKEND es la autoridad sobre validez
   * 
   * Usado para:
   * - Leer campos del token (id, usuario, email)
   * - Determinar cuándo expira (para UX: cerrar antes de expirar)
   * - NO para decidir si el usuario está autenticado
   */
  decodificarPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return null;

      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const decoded = atob(paddedBase64);
      const normalized = decodeURIComponent(
        decoded.split('').map((char) => {
          const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
          return `%${hex}`;
        }).join('')
      );

      return JSON.parse(normalized);
    } catch (e) {
      // Si no se puede decodificar, el token está corrupto
      this._limpiarSesion();
      return null;
    }
  }

  /**
   * ¿USUARIO AUTENTICADO?
   * 
   * Retorna true si:
   * 1. Token existe
   * 2. Token se puede decodificar
   * 3. Token no está localmente expirado (claim exp)
   * 
   * IMPORTANTE: Esto es para la UI (permitir botón login/logout)
   * NO es verificación de seguridad
   * El backend es quien realmente valida
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      this.sessionExpiredNotice.set('');
      return false;
    }

    const payload = this.decodificarPayload();
    if (!payload || !payload.exp) {
      // Token corrupto o sin exp
      this._terminarSesion('token_invalido_local');
      return false;
    }

    // Verificar si localmente está expirado
    // Pero NO confiar únicamente en esto
    const ahora = Date.now() / 1000;
    if (payload.exp <= ahora) {
      // Localmente vemos que expiró
      // Pero el backend es la autoridad definitiva
      this._terminarSesion('exp_local_detectada');
      return false;
    }

    // Limpieza visual (no hay aviso de expiración)
    this.sessionExpiredNotice.set('');
    return true;
  }

  /**
   * INICIALIZAR SESIÓN
   * Se ejecuta en constructor para restaurar sesión después de F5
   */
  private inicializarSesion(): void {
    const token = this.getToken();
    if (!token) {
      this.sessionExpiredNotice.set('');
      return;
    }

    const payload = this.decodificarPayload();
    if (!payload || !payload.exp) {
      // Token corrupto
      this._terminarSesion('token_corrupto_init');
      return;
    }

    const ahora = Date.now() / 1000;
    const tiempoRestante = payload.exp - ahora;

    if (tiempoRestante <= 0) {
      // Ya expiró
      this._terminarSesion('exp_en_init');
      return;
    }

    // Token válido localmente, programar cierre antes de expirar
    this.sessionExpiredNotice.set('');
    this.programarCierreAutomatico();
  }

  /**
   * PROGRAMAR CIERRE AUTOMÁTICO
   * Esta parte solo ayuda a la experiencia del cliente.
   * El objetivo es anticipar la expiración del token para cerrar la sesión
   * con una reacción visual más tranquila antes de que el backend rechace la petición.
   *
   * Importante: la validación real sigue siendo responsabilidad del backend.
   * El frontend solo interpreta el estado local del JWT para UX.
   */
  private programarCierreAutomatico(): void {
    // Limpiar timer anterior si existe
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }

    const payload = this.decodificarPayload();
    if (!payload?.exp) {
      return;
    }

    const ahora = Date.now() / 1000;
    const tiempoRestante = payload.exp - ahora;

    if (tiempoRestante <= 0) {
      // Ya está expirado
      this._terminarSesion('ya_expirado_programa');
      return;
    }

    // Cerrar DINÁMICAMENTE: 50% del tiempo antes de que expire
    // (si JWT_EXPIRES_IN=1s → cierra en 0.5s, si JWT_EXPIRES_IN=1h → cierra en 30min)
    const ANTICIPACION_PORCENTAJE = 0.5; // 50% del tiempo
    const tiempoEspera = Math.max(100, tiempoRestante * ANTICIPACION_PORCENTAJE * 1000);

    this.expirationTimer = setTimeout(() => {
      this._terminarSesion('cierre_automatico_previo');
    }, tiempoEspera);
  }

  /**
   * TERMINAR SESIÓN
   * 
   * Este método es el punto central de cierre de sesión de la aplicación.
   * Aquí se elimina el token y cualquier dato asociado para dejar el estado
   * limpio y evitar cierres dobles por peticiones 401 repetidas.
   *
   * El parámetro mostrarAviso permite separar el cierre manual del cierre por
   * expiración real, porque no todos los cierres necesitan mostrar un modal.
   *
   * @param reason - Motivo del cierre, solo para depuración.
   */
  private _terminarSesion(reason: string, mostrarAviso: boolean = true): void {
    // DEDUPLICACIÓN: Si ya hay un cierre en progreso, ignorar
    if (this.sessionTerminationInProgress) {
      return;
    }

    this.sessionTerminationInProgress = true;

    try {
      // Limpiar todo
      this._limpiarSesion();

      if (mostrarAviso) {
        // Mostrar aviso solo para expiración/401 reales
        this.sessionExpiredNotice.set('Tu sesión ha expirado. Debes iniciar sesión nuevamente.');
      } else {
        this.sessionExpiredNotice.set('');
      }

      // Log para debugging (opcional)
      console.log(`[AUTH] Sesión terminada. Razón: ${reason}`);
    } finally {
      // Resetear flag después de un tiempo (por si acaso)
      // Esto permite que si el usuario hace logout manual después,
      // no quede bloqueado
      setTimeout(() => {
        this.sessionTerminationInProgress = false;
      }, 500);
    }
  }

  /**
   * LIMPIAR SESIÓN
   * Elimina todo rastro de autenticación
   */
  private _limpiarSesion(): void {
    // Detener timer de expiración
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = undefined;
    }

    // Eliminar datos de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('perfilRegistro');
  }
}