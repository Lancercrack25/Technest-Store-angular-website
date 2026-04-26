import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  clientes: any[] = [];
  cargando: boolean = true;
  cargado: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('clientes');
      if (cached) {
        this.clientes = JSON.parse(cached);
        this.cargando = false;
        this.cargado = true;
      }
    }
    this.cargarClientes();
  }

  cargarClientes() {
    this.http.get('http://localhost:3000/cliente')
      .subscribe({
        next: (res: any) => {
          this.clientes = res;
          this.cargando = false;
          this.cargado = true;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('clientes', JSON.stringify(res));
          }
        },
        error: () => {
          this.cargando = false;
          this.cargado = true;
        }
      });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar cliente?',
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
        this.http.delete(`http://localhost:3000/cliente/${id}`)
          .subscribe({
            next: () => {
              this.clientes = this.clientes.filter(c => c.id_cliente !== id);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('clientes', JSON.stringify(this.clientes));
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
                text: 'No se pudo eliminar el cliente',
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
