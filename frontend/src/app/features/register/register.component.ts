import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  nombre = '';
  apellido = '';
  usuario = '';
  email = '';
  genero = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  mostrarPassword = false;

  constructor(private router: Router) {}

  onRegister(): void {
    if (!this.nombre || !this.apellido || !this.usuario || !this.email || !this.genero || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.errorMessage = '';
    this.successMessage = 'Vista de registro lista. Aquí no se guarda información en la base de datos.';
  }

  alternarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}