import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-provedores',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro-provedores.html',
  styleUrl: './registro-provedores.css',
})
export class RegistroProvedores {

  proveedor = {
    razon_social: '',
    rfc: '',
    contacto: '',
    email: '',
    telefono: ''
  };

  constructor(private http: HttpClient, private router: Router) {}
  guardar() {
  if (!this.proveedor.razon_social || !this.proveedor.rfc) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Razón social y RFC son obligatorios',
      background: '#0f172a',
      color: '#fff',
      confirmButtonColor: '#e01178'
    });
    return;
  }

  this.http.post('http://localhost:3000/proveedores', this.proveedor)
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Proveedor registrado!',
          text: 'El proveedor fue agregado correctamente',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff'
        }).then(() => {
          this.router.navigate(['/proveedores']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el proveedor',
          confirmButtonText: 'Intentar de nuevo',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#e01178'
        });
      }
    });
}
}