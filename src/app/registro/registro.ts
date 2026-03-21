import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  constructor(private http: HttpClient, private router: Router) {}

  api = 'http://localhost:3000';

  form = {
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  };

  confirmPassword = '';

  registrar() {
    const { nombre, email, telefono, password } = this.form;

    // 1. Validar campos vacíos
    if (!nombre || !email || !telefono || !password || !this.confirmPassword) {
      Swal.fire('Campos incompletos', 'Llena todos los campos', 'warning');
      return;
    }

    // 2. Validar contraseñas iguales
    if (password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    // 3. Enviar al backend
    this.http.post(`${this.api}/clientes`, {
      nombre,
      email,
      telefono,
      password,
      rol: 'cliente'
    }).subscribe({
      next: () => {
        Swal.fire('Registro exitoso', 'Usuario creado correctamente', 'success');

          setTimeout(() => {
        this.router.navigate(['/']);
        }, 5000);
      },
      error: (err) => {
        Swal.fire('Error', err.error?.error || 'No se pudo registrar', 'error');
      }
    });
  }
}
