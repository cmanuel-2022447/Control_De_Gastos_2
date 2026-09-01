import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppShellComponent } from '../../shared/app-shell/app-shell.component';
import { IngresosService, IngresoData } from '../../core/services/ingresos.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, AppShellComponent],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css'
})
export class IngresosComponent implements OnInit, OnDestroy {
  readonly tasaCambio = 7.68;
  mostrarFormulario = false;
  editandoId: number | null = null;
  nuevoIngreso = this.formularioVacio();

  ingresos: Ingreso[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private ingresosService: IngresosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los ingresos del servicio compartido
    this.ingresosService.ingresos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((ingresos) => {
        this.ingresos = this.convertirAlFormatoLocal(ingresos);
        // Fuerza detección de cambios porque usamos provideZonelessChangeDetection()
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get ingresosFiltrados(): Ingreso[] {
    return this.ingresos;
  }

  get totalQuetzales(): number {
    return this.ingresos.reduce((total, ingreso) => total + this.aQuetzales(ingreso), 0);
  }

  get montoConvertido(): number {
    const monto = Number(this.nuevoIngreso.monto) || 0;
    if (this.nuevoIngreso.moneda === this.nuevoIngreso.monedaDestino) return monto;
    if (this.nuevoIngreso.moneda === 'USD' && this.nuevoIngreso.monedaDestino === 'GTQ') {
      return monto * this.tasaCambio;
    }
    if (this.nuevoIngreso.moneda === 'GTQ' && this.nuevoIngreso.monedaDestino === 'USD') {
      return monto / this.tasaCambio;
    }
    return monto;
  }

  get tasaReferencia(): string {
    const origen = this.nuevoIngreso.moneda;
    const destino = this.nuevoIngreso.monedaDestino;

    if (origen === destino) return `1 ${origen} = 1 ${destino}`;
    if (origen === 'USD' && destino === 'GTQ') return `1 USD = Q ${this.tasaCambio.toFixed(2)}`;
    if (origen === 'GTQ' && destino === 'USD') return `1 GTQ = $ ${(1 / this.tasaCambio).toFixed(4)}`;
    return `1 ${origen} = 1 ${destino}`;
  }

  aQuetzales(ingreso: Ingreso): number {
    return ingreso.moneda === 'USD' ? (ingreso.montoQuetzales ?? ingreso.monto * this.tasaCambio) : ingreso.monto;
  }

  abrirFormulario(): void {
    this.editandoId = null;
    this.nuevoIngreso = this.formularioVacio();
    this.mostrarFormulario = true;
  }

  editarIngreso(ingreso: Ingreso): void {
    this.editandoId = ingreso.id;
    this.nuevoIngreso = { ...ingreso };
    this.mostrarFormulario = true;
  }

  guardarIngreso(): void {
    const monto = Number(this.nuevoIngreso.monto) || 0;
    if (!this.nuevoIngreso.descripcion || !this.nuevoIngreso.lugar || !this.nuevoIngreso.fecha || monto <= 0) return;

    const payload = {
      ...this.nuevoIngreso,
      fecha: String(this.nuevoIngreso.fecha).slice(0, 10),
      moneda: this.nuevoIngreso.moneda,
      monto
    };

    this.ingresosService.guardarIngreso(payload, this.editandoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error guardando ingreso:', err);
        }
      });
  }

  eliminarIngreso(id: number): void {
    this.ingresosService.eliminarIngreso(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => console.error('Error eliminando ingreso:', err)
      });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.nuevoIngreso = this.formularioVacio();
  }

  private convertirAlFormatoLocal(ingresos: IngresoData[]): Ingreso[] {
    return ingresos.map(ing => ({
      id: ing.id,
      fecha: ing.fecha,
      descripcion: ing.descripcion,
      lugar: ing.lugar,
      moneda: ing.moneda,
      monedaDestino: ing.monedaDestino,
      monto: ing.monto,
      montoQuetzales: ing.montoQuetzales
    }));
  }

  private formularioVacio(): Ingreso {
    return { id: 0, fecha: new Date().toISOString().slice(0, 10), descripcion: '', lugar: '', moneda: 'GTQ', monedaDestino: 'USD', monto: 0, montoQuetzales: 0 };
  }
}

interface Ingreso {
  id: number;
  fecha: string;
  descripcion: string;
  lugar: string;
  moneda: 'GTQ' | 'USD';
  monedaDestino: 'GTQ' | 'USD';
  monto: number;
  montoQuetzales: number;
}