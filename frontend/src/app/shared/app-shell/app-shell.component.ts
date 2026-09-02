import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IngresosService } from '../../core/services/ingresos.service';

type ResultadoBusqueda = {
  texto: string;
  selector: string;
  ruta: string;
};

type ContenidoBuscable = string | ResultadoBusqueda;

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css'
})
export class AppShellComponent implements OnInit {
  @Input() activePage = '';
  @Input() searchableContent: ContenidoBuscable[] = [];
  configuracionesAbiertas = false;
  perfilAbierto = false;
  modoOscuro = false;
  busqueda = '';

  private readonly registrosEnBusqueda: ResultadoBusqueda[] = [];

  private readonly informacionPorPagina: Record<string, string[]> = {
    dashboard: ['Dashboard', 'Resumen de hoy', 'Dinero restante', 'Ingresos', 'Gastos', 'Presupuesto para el evento', 'Extras'],
    ingresos: ['Ingresos', 'Historial de ingresos', 'Total registrado', 'Tasa de cambio', 'Descripción', 'Lugar', 'Fecha', 'Original', 'Conversion'],
    gastos: ['Gastos', 'Estos son los gastos', 'Resumen de gastos', 'Presupuesto'],
    'planificar-evento': ['Planificar evento', 'Presupuesto del evento', 'Lista de tareas', 'Invitados'],
    perfil: ['Perfil', 'Configuración', 'Usuario', 'Correo', 'Rol'],
    ayuda: ['Ayuda', 'Soporte', 'Guía', 'Tutorial', 'Preguntas frecuentes']
  };

  private readonly selectoresPorPagina: Record<string, Record<string, { selector: string; ruta: string }>> = {
    dashboard: {
      dashboard: { selector: '#dashboard-section', ruta: '/dashboard' },
      'resumen de hoy': { selector: '#resumen-hoy', ruta: '/dashboard' },
      'dinero restante': { selector: '#resumen-hoy', ruta: '/dashboard' },
      ingresos: { selector: '#resumen-hoy', ruta: '/dashboard' },
      gastos: { selector: '#resumen-hoy', ruta: '/dashboard' },
      'presupuesto para el evento': { selector: '#extras-section', ruta: '/dashboard' },
      extras: { selector: '#extras-section', ruta: '/dashboard' }
    },
    ingresos: {
      ingresos: { selector: '#ingresos-header', ruta: '/ingresos' },
      'historial de ingresos': { selector: '#historial-ingresos', ruta: '/ingresos' },
      'total registrado': { selector: '#resumen-ingresos', ruta: '/ingresos' },
      'tasa de cambio': { selector: '#resumen-ingresos', ruta: '/ingresos' },
      descripción: { selector: '#historial-ingresos', ruta: '/ingresos' },
      lugar: { selector: '#historial-ingresos', ruta: '/ingresos' },
      fecha: { selector: '#historial-ingresos', ruta: '/ingresos' },
      original: { selector: '#historial-ingresos', ruta: '/ingresos' },
      conversion: { selector: '#historial-ingresos', ruta: '/ingresos' }
    },
    gastos: {
      gastos: { selector: '#gastos-header', ruta: '/gastos' },
      presupuesto: { selector: '#gastos-header', ruta: '/gastos' }
    },
    'planificar-evento': {
      'planificar evento': { selector: '#evento-header', ruta: '/planificar-evento' },
      'presupuesto del evento': { selector: '#evento-header', ruta: '/planificar-evento' }
    },
    perfil: {
      perfil: { selector: '#perfil-header', ruta: '/perfil' },
      configuración: { selector: '#perfil-header', ruta: '/perfil' },
      usuario: { selector: '#perfil-header', ruta: '/perfil' },
      correo: { selector: '#perfil-header', ruta: '/perfil' },
      rol: { selector: '#perfil-header', ruta: '/perfil' }
    },
    ayuda: {
      ayuda: { selector: '#ayuda-header', ruta: '/ayuda' },
      soporte: { selector: '#ayuda-header', ruta: '/ayuda' },
      guía: { selector: '#ayuda-header', ruta: '/ayuda' },
      tutorial: { selector: '#ayuda-header', ruta: '/ayuda' },
      'preguntas frecuentes': { selector: '#ayuda-header', ruta: '/ayuda' }
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private ingresosService: IngresosService
  ) {
    this.modoOscuro = localStorage.getItem('modoOscuro') === 'true';
  }

  ngOnInit(): void {
    this.ingresosService.ingresos$.subscribe((ingresos) => {
      this.registrosEnBusqueda.length = 0;
      this.registrosEnBusqueda.push(...this.construirResultadosDesdeIngresos(ingresos));
    });
  }

  alternarConfiguraciones(): void {
    this.configuracionesAbiertas = !this.configuracionesAbiertas;
  }

  cambiarTema(modoOscuro: boolean): void {
    this.modoOscuro = modoOscuro;
    localStorage.setItem('modoOscuro', String(modoOscuro));
  }

  alternarPerfil(): void {
    this.perfilAbierto = !this.perfilAbierto;
  }

  get datosPerfil(): { nombre: string; apellido: string; usuario: string; correo: string; genero: string; rol: string } {
    const token = this.authService.decodificarPayload() || {};
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

  get resultadosBusqueda(): ResultadoBusqueda[] {
    const consulta = this.busqueda.trim().toLowerCase();
    if (!consulta) return [];

    const contenidoBuscable = [
      ...Object.values(this.informacionPorPagina).flat(),
      ...(this.searchableContent || []),
      ...this.registrosEnBusqueda
    ];
    const vistos = new Set<string>();

    return contenidoBuscable
      .map(item => this.normalizarResultado(item))
      .filter(resultado => {
        const coincide = resultado.texto.toLowerCase().includes(consulta);
        if (!coincide) return false;

        const clave = resultado.texto.trim().toLowerCase();
        if (vistos.has(clave)) return false;
        vistos.add(clave);
        return true;
      })
      .slice(0, 8);
  }

  get busquedaResaltada(): string {
    const consulta = this.busqueda.trim();
    if (!consulta) return '';
    return consulta;
  }

  private normalizarResultado(item: ContenidoBuscable): ResultadoBusqueda {
    if (typeof item === 'string') {
      return this.obtenerResultado(item);
    }

    return {
      texto: item.texto || '',
      selector: item.selector || this.obtenerResultado(item.texto || '').selector,
      ruta: item.ruta || this.obtenerResultado(item.texto || '').ruta
    };
  }

  private construirResultadosDesdeIngresos(ingresos: Array<{ id?: number; fecha?: string; descripcion?: string; lugar?: string; moneda?: string; monto?: number; monedaDestino?: string; original?: string; conversion?: string }>): ResultadoBusqueda[] {
    return ingresos.flatMap((ingreso) => {
      const id = ingreso.id ?? 0;
      const fecha = String(ingreso.fecha || '').trim();
      const descripcion = String(ingreso.descripcion || '').trim();
      const lugar = String(ingreso.lugar || '').trim();
      const moneda = String(ingreso.moneda || 'GTQ').trim();
      const monto = Number(ingreso.monto || 0);
      const monedaDestino = String(ingreso.monedaDestino || (moneda === 'USD' ? 'GTQ' : 'USD')).trim();
      const conversionTexto = String(ingreso.conversion || '').trim();
      const originalTexto = String(ingreso.original || '').trim();
      const campos = [
        descripcion,
        lugar,
        fecha,
        `${moneda} ${monto.toFixed(2)}`,
        `${monedaDestino} ${Number(ingreso.monto || 0).toFixed(2)}`,
        originalTexto,
        conversionTexto
      ].filter(Boolean);

      return campos.map((texto) => ({
        texto: `Ingreso • ${texto}`,
        selector: id ? `#ingreso-row-${id}` : '#historial-ingresos',
        ruta: '/ingresos'
      }));
    });
  }

  private obtenerResultado(texto: string): ResultadoBusqueda {
    const clave = texto
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    for (const pagina of Object.values(this.selectoresPorPagina)) {
      for (const [claveBase, detalle] of Object.entries(pagina)) {
        const claveBaseNormalizada = claveBase
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (!claveBaseNormalizada) continue;
        if (clave.includes(claveBaseNormalizada) || claveBaseNormalizada.includes(clave)) {
          return {
            texto,
            selector: detalle.selector,
            ruta: detalle.ruta
          };
        }
      }
    }

    return { texto, selector: '', ruta: this.activePage ? `/${this.activePage}` : '/' };
  }

  irAResultado(resultado: ResultadoBusqueda): void {
    const selector = resultado.selector;
    const ruta = resultado.ruta || `/${this.activePage}`;

    const navegarYScroll = () => {
      const elemento = document.querySelector(selector) as HTMLElement | null;
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        elemento.focus();
      }
      this.busqueda = '';
    };

    if (ruta !== this.router.url) {
      this.router.navigateByUrl(ruta).then(() => {
        setTimeout(navegarYScroll, 150);
      });
      return;
    }

    navegarYScroll();
  }

  get etiquetaRol(): string {
    return this.datosPerfil.rol.toUpperCase() === 'ADMIN' ? 'Admin' : 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
