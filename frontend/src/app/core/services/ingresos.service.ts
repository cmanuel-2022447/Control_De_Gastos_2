import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface IngresoData {
  id: number;
  fecha: string;
  descripcion: string;
  lugar: string;
  moneda: 'GTQ' | 'USD';
  monedaDestino: 'GTQ' | 'USD';
  monto: number;
  montoQuetzales: number;
  original?: string;
  conversion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private readonly apiUrl = 'http://localhost:3000/api/ingresos';
  private readonly ingresosSubject = new BehaviorSubject<IngresoData[]>([]);
  
  public readonly ingresos$ = this.ingresosSubject.asObservable();
  
  private ingresosCache$: Observable<IngresoData[]> | null = null;

  constructor(private http: HttpClient) {
    this.cargarIngresosInicial();
  }

  /**
   * Carga inicial de ingresos desde la base de datos
   */
  private cargarIngresosInicial(): void {
    this.obtenerIngresosDelServidor().subscribe(
      (data) => {
        this.ingresosSubject.next(this.transformarIngresos(data));
      },
      (error) => {
        console.error('Error cargando ingresos iniciales:', error);
        this.ingresosSubject.next([]);
      }
    );
  }

  /**
   * Obtiene los ingresos desde el servidor con caché
   */
  private obtenerIngresosDelServidor(): Observable<any[]> {
    if (!this.ingresosCache$) {
      this.ingresosCache$ = this.http.get<any[]>(this.apiUrl).pipe(
        shareReplay(1)
      );
    }
    return this.ingresosCache$;
  }

  /**
   * Recarga los ingresos desde el servidor
   */
  public recargarIngresos(): Observable<IngresoData[]> {
    this.ingresosCache$ = null;
    return this.obtenerIngresosDelServidor().pipe(
      tap((data) => {
        const ingresosTransformados = this.transformarIngresos(data);
        this.ingresosSubject.next(ingresosTransformados);
      })
    );
  }

  /**
   * Guarda un nuevo ingreso o actualiza uno existente
   */
  public guardarIngreso(ingreso: any, id?: number | null): Observable<any> {
    const payload = this.prepararPayload(ingreso);
    
    const request = id === null || id === undefined
      ? this.http.post<any>(this.apiUrl, payload)
      : this.http.put<any>(`${this.apiUrl}/${id}`, payload);

    return request.pipe(
      tap(() => {
        // Recarga los ingresos después de guardar
        this.recargarIngresos().subscribe();
      })
    );
  }

  /**
   * Elimina un ingreso
   */
  public eliminarIngreso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Recarga los ingresos después de eliminar
        this.recargarIngresos().subscribe();
      })
    );
  }

  /**
   * Obtiene los ingresos actuales del Subject (estado local)
   */
  public obtenerIngresosActuales(): IngresoData[] {
    return this.ingresosSubject.value;
  }

  /**
   * Transforma los datos crudos del servidor al formato esperado
   */
  private transformarIngresos(data: any[]): IngresoData[] {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((ingreso) => {
      const original = String(ingreso.original || '').trim();
      const [monedaOriginal, montoOriginal] = original.split(' ');
      const conversion = String(ingreso.conversion || '').trim();
      const [monedaConversion] = conversion.split(' ');

      return {
        id: ingreso.id,
        fecha: String(ingreso.fecha ?? '').slice(0, 10),
        descripcion: ingreso.descripcion,
        lugar: ingreso.lugar,
        moneda: (monedaOriginal as 'GTQ' | 'USD') || 'GTQ',
        monedaDestino: (monedaConversion as 'GTQ' | 'USD') || 'USD',
        monto: Number(montoOriginal || 0),
        montoQuetzales: Number(montoOriginal || 0),
        original: ingreso.original,
        conversion: ingreso.conversion
      };
    });
  }

  /**
   * Prepara el payload para enviar al backend
   */
  private prepararPayload(ingreso: any): any {
    const tasaCambio = 7.68;
    const monto = Number(ingreso.monto) || 0;
    
    return {
      ...ingreso,
      fecha: String(ingreso.fecha).slice(0, 10),
      moneda: ingreso.moneda,
      monto,
      tasa_cambio: tasaCambio,
      original: `${ingreso.moneda} ${monto.toFixed(2)}`,
      conversion: `${ingreso.moneda === 'USD' ? 'GTQ' : 'USD'} ${tasaCambio.toFixed(2)}`
    };
  }
}
