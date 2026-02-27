import { Component,HostListener } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Adminlogin } from '../adminlogin/adminlogin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    nombre = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  // ==========================
  // LOGIN NORMAL
  // ==========================
  login() {

    if (!this.nombre || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Debe completar usuario y contraseña'
      });
      return;
    }

    this.http.post<any>('http://localhost:3000/login', {
      nombre: this.nombre,
      password: this.password
    }).subscribe({
      next: (res) => {

        localStorage.setItem('usuario', JSON.stringify(res));

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          timer: 1500,
          showConfirmButton: false
        });

        // 👇 CAMBIA ESTA RUTA si quieres otro componente
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.error || 'Credenciales incorrectas'
        });
      }
    });
  }

  // ==========================
  // ATAJO Ctrl + L
  // ==========================
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();

      this.router.navigate(['/adminlogin']); 
      // 👆 cambia la ruta si quieres otro componente
    }
  }
}
