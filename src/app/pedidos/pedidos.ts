import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Navbar } from "../navbar/navbar";
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [Navbar, CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {

  pedidos: any[] = [];
  cargando: boolean = true;
  cargado: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) return;

    this.http.get(`http://localhost:3000/pedidos/${user.id_cliente}`)
      .subscribe({
        next: (res: any) => {
          this.pedidos = res;
          this.cargando = false;
          this.cargado = true;
        },
        error: () => {
          this.cargando = false;
          this.cargado = true;
        }
      });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN'
    }).format(monto);
  }

  cancelarPedido(id: string) {
    Swal.fire({
      title: '¿Cancelar pedido?',
      text: `Estás a punto de cancelar la orden ${id}. Esta acción es irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e01178',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      background: '#0f172a',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`http://localhost:3000/ventas/${id}/cancelar`, {})
          .subscribe({
            next: () => {
              this.pedidos = this.pedidos.map(p =>
                p.id_venta === id ? { ...p, estado: 'Cancelada' } : p
              );
              Swal.fire({
                title: 'Pedido cancelado',
                icon: 'success',
                background: '#0f172a',
                color: '#ffffff',
                confirmButtonColor: '#e01178',
                timer: 1500,
                showConfirmButton: false
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo cancelar el pedido',
                icon: 'error',
                background: '#0f172a',
                color: '#ffffff',
                confirmButtonColor: '#e01178'
              });
            }
          });
      }
    });
  }
}