import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [Navbar],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit{
  
  productos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerProductos();
}

  obtenerProductos() {

  this.http.get<any[]>('http://localhost:3000/productos')
    .subscribe({

      next: (data) => {
        this.productos = [...data];
        console.log(data);
      },

      error: (error) => {
        console.error(error);
      }

    });

}

agregarAlCarrito(producto: any) {

  // obtener cliente guardado
  const cliente = JSON.parse(localStorage.getItem('cliente') || '{}');

  // validar login
  if (!cliente.id_cliente) {

    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para agregar productos'
    });

    return;
  }

  // crear carrito
  this.http.post<any>('http://localhost:3000/carrito', {
    id_cliente: cliente.id_cliente
  }).subscribe({

    next: (carrito) => {

      // agregar producto al carrito
      this.http.post('http://localhost:3000/carrito/detalle', {

        id_carrito: carrito.id_carrito,
        id_producto: producto.id_producto,
        cantidad: 1

      }).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            timer: 1200,
            showConfirmButton: false
          });

        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar al carrito'
          });

        }

      });

    }

  });

}


}
