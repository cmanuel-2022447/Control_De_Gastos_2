import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  configuracionesAbiertas = false;
  perfilAbierto = false;
  modoOscuro = false;
  busqueda = '';
  dineroRestante = 5254.50;
  dineroGastado = 2254.50;
  deudaPorPagar = 0;
  presupuestoEvento = 800.00;

  private readonly informacionDashboard = [
    'Resumen de hoy',
    'Tu dinero en perspectiva',
    'Gastos del mes',
    'Movimientos',
    'Todo bajo control',
    'Empieza a registrar',
    'Añadir gasto'
    , 'Dinero restante', 'Dinero gastado', 'Gastos', 'Ingresos', 'Deuda por pagar', 'Presupuesto para el evento'
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  alternarConfiguraciones(): void {
    this.configuracionesAbiertas = !this.configuracionesAbiertas;
  }

  cambiarTema(modoOscuro: boolean): void {
    this.modoOscuro = modoOscuro;
  }

  irAGastos(): void {
    this.router.navigate(['/gastos']);
  }

  irAIngresos(): void {
    this.router.navigate(['/ingresos']);
  }

  alternarPerfil(): void {
    this.perfilAbierto = !this.perfilAbierto;
  }

  get datosPerfil(): { nombre: string; apellido: string; usuario: string; correo: string; genero: string; rol: string } {
    const token = this.authService.getUserPayload() || {};
    let registro: Partial<{ nombre: string; apellido: string; usuario: string; correo: string; genero: string }> = {};
    try {
      registro = JSON.parse(localStorage.getItem('perfilRegistro') || '{}');
    } catch {
      registro = {};
    }
    return {
      nombre: registro.nombre || 'Usuario',
      apellido: registro.apellido || '',
      usuario: token.usuario || registro.usuario || 'Sin usuario',
      correo: registro.correo || token.email || 'Sin correo',
      genero: registro.genero || 'No especificado',
      rol: token.rol || localStorage.getItem('rol') || 'USUARIO'
    };
  }

  get resultadosBusqueda(): string[] {
    const consulta = this.busqueda.trim().toLowerCase();
    if (!consulta) return [];
    return this.informacionDashboard.filter(texto => texto.toLowerCase().includes(consulta));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
