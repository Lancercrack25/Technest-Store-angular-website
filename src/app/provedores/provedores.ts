import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provedores',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './provedores.html',
  styleUrl: './provedores.css',
})
export class Provedores implements OnInit {

  proveedores: any[] = [];
  cargando: boolean = true;
  cargado: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('proveedores');
      if (cached) {
        this.proveedores = JSON.parse(cached);
        this.cargando = false;
        this.cargado = true;
      }
    }
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.http.get('http://localhost:3000/proveedores')
      .subscribe({
        next: (res: any) => {
          this.proveedores = res;
          this.cargando = false;
          this.cargado = true;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('proveedores', JSON.stringify(res));
          }
        },
        error: () => {
          this.cargando = false;
          this.cargado = true;
        }
      });
  }

  eliminar(id: string) {
    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#0f172a',
      color: '#fff',
      confirmButtonColor: '#e01178',
      cancelButtonColor: '#334155'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/proveedores/${id}`)
          .subscribe({
            next: () => {
              this.proveedores = this.proveedores.filter(p => p.id_proveedor !== id);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('proveedores', JSON.stringify(this.proveedores));
              }
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                timer: 1500,
                showConfirmButton: false,
                background: '#0f172a',
                color: '#fff'
              });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el proveedor',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#e01178'
              });
            }
          });
      }
    });
  }
}