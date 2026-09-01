import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements AfterViewInit {
  loginValue: string = '';
  password: string = '';
  error: string = '';
  mostrarPassword = false;
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Componente Login inicializado');
    }
  }

  login(): void {
    if (!this.loginValue || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.authService.login({ login: this.loginValue, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.cargando = false;
        this.error = err.status === 503
          ? 'La base de datos no está disponible.'
          : 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }

  alternarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

}
