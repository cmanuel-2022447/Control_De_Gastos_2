import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppShellComponent } from '../../shared/app-shell/app-shell.component';
import { IngresosService } from '../../core/services/ingresos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AppShellComponent],
  template: `
    <app-shell #shell activePage="dashboard" [searchableContent]="dashboardSearchTerms">
      <section class="content financial-content" [class.dark-mode]="shell.modoOscuro" id="dashboard-section">
        <div class="financial-grid">
          <section class="summary-card" id="resumen-hoy">
            <p class="eyebrow">RESUMEN DE HOY</p>
            <article class="balance-card">
              <div>
                <span class="stat-label">DINERO RESTANTE</span>
                <strong>Q {{ dineroRestante | number:'1.2-2' }}</strong>
              </div>
              <img src="assets/img/Dinero.png" alt="Dinero restante" />
            </article>
            <div class="income-chart-block">
              <div class="income-chart" [style.background]="graficaIngresos" role="img" aria-label="Gráfica circular de ingresos y gastos">
                <div class="income-chart-center"><strong>Q {{ totalIngresos | number:'1.2-2' }}</strong><span>Ingresos</span></div>
              </div>
              <div class="chart-legend">
                <span><i class="legend-income"></i>Ingresos</span>
                <span><i class="legend-expense"></i>Gastos</span>
              </div>
            </div>
            <div class="summary-actions">
              <button type="button" class="summary-action expense-action" routerLink="/gastos">
                <img src="assets/img/Cartera.png" alt="" /> Gastos
              </button>
              <button type="button" class="summary-action income-action" routerLink="/ingresos">
                <img src="assets/img/Conchinito.png" alt="" /> Ingresos
              </button>
            </div>
          </section>

          <section class="extras-card" id="extras-section">
            <div class="extras-heading">
              <h3>EXTRAS</h3>
              <div class="theme-switch">
                <button type="button" [class.selected]="shell.modoOscuro" (click)="shell.cambiarTema(true)"><img src="assets/img/Oscuro.png" alt="" /> Oscuro</button>
                <button type="button" [class.selected]="!shell.modoOscuro" (click)="shell.cambiarTema(false)"><img src="assets/img/Claro.png" alt="" /> Claro</button>
              </div>
            </div>
            <div class="extra-cards">
              <article class="extra-card spent-card">
                <span>Dinero gastado</span>
                <strong>Q {{ dineroGastado | number:'1.2-2' }}</strong>
                <img src="assets/img/Cartera.png" alt="" />
              </article>
              <article class="extra-card debt-card">
                <span>Total de deuda<br />a pagar</span>
                <strong>Q {{ deudaPorPagar | number:'1.2-2' }}</strong>
                <img src="assets/img/Conchinito.png" alt="" />
              </article>
              <article class="extra-card event-card">
                <span>Presupuesto para<br />el evento</span>
                <strong>Q {{ presupuestoEvento | number:'1.2-2' }}</strong>
                <small>Boda</small>
                <img src="assets/img/Globos.png" alt="" />
              </article>
            </div>
            <div class="chart" aria-label="Presupuesto por periodo">
              <div class="bar-item" *ngFor="let barra of barrasPresupuesto">
                <span class="bar" [style.height.%]="barra.porcentaje" [title]="barra.etiqueta + ': Q ' + barra.monto"></span>
                <small>{{ barra.etiqueta }}</small>
              </div>
            </div>
          </section>
        </div>
      </section>
    </app-shell>
  `,
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly tasaCambio = 7.68;

  get dashboardSearchTerms(): Array<{ texto: string; selector: string; ruta: string }> {
    return [
      { texto: 'Dashboard', selector: '#dashboard-section', ruta: '/dashboard' },
      { texto: 'Resumen de hoy', selector: '#resumen-hoy', ruta: '/dashboard' },
      { texto: `Dinero restante Q ${this.dineroRestante.toFixed(2)}`, selector: '#resumen-hoy', ruta: '/dashboard' },
      { texto: `Ingresos Q ${this.totalIngresos.toFixed(2)}`, selector: '#resumen-hoy', ruta: '/dashboard' },
      { texto: `Gastos Q ${this.totalGastos.toFixed(2)}`, selector: '#resumen-hoy', ruta: '/dashboard' },
      { texto: `Dinero gastado Q ${this.dineroGastado.toFixed(2)}`, selector: '#extras-section', ruta: '/dashboard' },
      { texto: `Deuda por pagar Q ${this.deudaPorPagar.toFixed(2)}`, selector: '#extras-section', ruta: '/dashboard' },
      { texto: `Presupuesto para el evento Q ${this.presupuestoEvento.toFixed(2)}`, selector: '#extras-section', ruta: '/dashboard' },
      { texto: 'Extras', selector: '#extras-section', ruta: '/dashboard' },
      { texto: `Ingresos ${this.porcentajeIngresos}%`, selector: '#resumen-hoy', ruta: '/dashboard' }
    ];
  }

  totalIngresos = 0;
  totalGastos = 0;
  dineroRestante = 0;
  dineroGastado = 0;
  deudaPorPagar = 0;
  presupuestoEvento = 0;
  porcentajeIngresos = 0;
  graficaIngresos = 'conic-gradient(#194c84 0 0%, #9fd7e8 0% 100%)';
  barrasPresupuesto = [
    { etiqueta: 'Ene', monto: '0.00', porcentaje: 0 },
    { etiqueta: 'Feb', monto: '0.00', porcentaje: 0 },
    { etiqueta: 'Mar', monto: '0.00', porcentaje: 0 }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private ingresosService: IngresosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de ingresos desde el servicio compartido
    this.ingresosService.ingresos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((ingresos) => {
        this.totalIngresos = this.calcularTotalIngresos(ingresos);
        this.totalGastos = 0;
        this.dineroGastado = this.totalGastos;
        this.deudaPorPagar = 0;
        this.presupuestoEvento = 0;
        this.dineroRestante = this.totalIngresos - this.totalGastos;
        this.actualizarGrafica();
        this.actualizarBarras();
        // Fuerza detección de cambios porque usamos provideZonelessChangeDetection()
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calcularTotalIngresos(ingresos: any[]): number {
    if (!ingresos?.length) return 0;

    return ingresos.reduce((total, ingreso) => {
      const monto = ingreso.monto || 0;
      const moneda = ingreso.moneda || 'GTQ';

      if (moneda === 'USD') {
        return total + (Number(monto || 0) * this.tasaCambio);
      }

      return total + Number(monto || 0);
    }, 0);
  }

  private actualizarGrafica(): void {
    const totalBase = this.totalIngresos + this.totalGastos;
    this.porcentajeIngresos = totalBase > 0 ? Math.round((this.totalIngresos / totalBase) * 100) : 0;
    this.graficaIngresos = `conic-gradient(#194c84 0 ${this.porcentajeIngresos}%, #9fd7e8 ${this.porcentajeIngresos}% 100%)`;
  }

  private actualizarBarras(): void {
    this.barrasPresupuesto = [
      { etiqueta: 'Ene', monto: '0.00', porcentaje: this.totalIngresos > 0 ? 0 : 0 },
      { etiqueta: 'Feb', monto: '0.00', porcentaje: 0 },
      { etiqueta: 'Mar', monto: '0.00', porcentaje: 0 }
    ];
  }

  private resetearTotales(): void {
    this.totalIngresos = 0;
    this.totalGastos = 0;
    this.dineroRestante = 0;
    this.dineroGastado = 0;
    this.deudaPorPagar = 0;
    this.presupuestoEvento = 0;
    this.porcentajeIngresos = 0;
    this.graficaIngresos = 'conic-gradient(#194c84 0 0%, #9fd7e8 0% 100%)';
    this.barrasPresupuesto = [
      { etiqueta: 'Ene', monto: '0.00', porcentaje: 0 },
      { etiqueta: 'Feb', monto: '0.00', porcentaje: 0 },
      { etiqueta: 'Mar', monto: '0.00', porcentaje: 0 }
    ];
  }
}
