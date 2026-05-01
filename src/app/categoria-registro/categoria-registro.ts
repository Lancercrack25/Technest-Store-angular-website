import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './categoria-registro.html',
  styleUrl: './categoria-registro.css',
})

export class CategoriaRegistro {

  categoria = {
    id_categoria: '',
    nombre: '',
    descripcion: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  guardar() {
    if (!this.categoria.id_categoria || !this.categoria.nombre) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'ID y nombre son obligatorios',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#e01178'
      });
      return;
    }

    this.http.post('http://localhost:3000/categorias', this.categoria)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Categoría registrada!',
            text: 'La categoría fue agregada correctamente',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#fff'
          }).then(() => {
            this.router.navigate(['/admin/panel']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.error || 'No se pudo registrar la categoría',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#e01178'
          });
        }
      });
  }
}
