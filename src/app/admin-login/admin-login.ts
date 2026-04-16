import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
})

export class AdminLogin {

  credentials = { nombre: '', password: '' };
  mostrarPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:3000/admin/login', this.credentials)
      .subscribe({
        next: () => {
          localStorage.setItem('admin', 'true');

          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Acceso concedido al panel de administrador',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#fff',
          }).then(() => {
            this.router.navigate(['/admin/panel']);
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Nombre o contraseña incorrectos',
            confirmButtonText: 'Intentar de nuevo',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#e01178',
          });
        }
      });
  }
}



