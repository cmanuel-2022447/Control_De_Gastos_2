import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css'
})
export class AppShellComponent {
  @Input() activePage = '';
  configuracionesAbiertas = false;
  perfilAbierto = false;
  modoOscuro = false;
  busqueda = '';

  private readonly informacionPorPagina: Record<string, string[]> = {
    ingresos: ['Ingresos', 'Esta sección está en creación'],
    gastos: ['Gastos', 'Esta sección está en creación'],
    'planificar-evento': ['Planificar evento', 'Esta sección está en creación'],
    perfil: ['Perfil', 'Esta sección está en creación'],
    ayuda: ['Ayuda', 'Esta sección está en creación']
  };

  constructor(private authService: AuthService, private router: Router) {}

  alternarConfiguraciones(): void {
    this.configuracionesAbiertas = !this.configuracionesAbiertas;
  }

  cambiarTema(modoOscuro: boolean): void {
    this.modoOscuro = modoOscuro;
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
    return (this.informacionPorPagina[this.activePage] || [])
      .filter(texto => texto.toLowerCase().includes(consulta));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
