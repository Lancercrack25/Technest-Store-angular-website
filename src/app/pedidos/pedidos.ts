import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [Navbar, CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
  pedidos = [
    { id: 'TN-4582', fecha: '2026-04-10', total: 1549.99, estado: 'Enviado' },
    { id: 'TN-4590', fecha: '2026-04-12', total: 850.00, estado: 'Pendiente' },
    { id: 'TN-4601', fecha: '2026-04-14', total: 2100.50, estado: 'Pendiente' },
    { id: 'TN-3920', fecha: '2026-03-28', total: 120.00, estado: 'Cancelado' }
  ];

  cancelarPedido(id: string) {
    // 2. Usamos Swal.fire con diseño Stealth Red (Fondo oscuro, botones rojos)
    Swal.fire({
      title: '¿CANCELAR PEDIDO?',
      text: `Estás a punto de cancelar la orden ${id}. Esta acción es irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000', // Rojo TechNest
      cancelButtonColor: '#333333',  // Gris oscuro
      confirmButtonText: 'SÍ, CANCELAR',
      cancelButtonText: 'VOLVER',
      background: '#141414', // Fondo casi negro
      color: '#ffffff'       // Texto blanco
    }).then((result) => {
      // 3. Si el usuario le da al botón rojo...
      if (result.isConfirmed) {
        
        // Cambiamos el estado en la tabla
        this.pedidos = this.pedidos.map(p => 
          p.id === id ? { ...p, estado: 'Cancelado' } : p
        );

        // Lanzamos una mini-alerta de confirmación
        Swal.fire({
          title: '¡ORDEN CANCELADA!',
          text: `El pedido ${id} ha sido cancelado con éxito.`,
          icon: 'success',
          background: '#141414',
          color: '#ffffff',
          confirmButtonColor: '#ff0000'
        });
      }
    });
  }

}
