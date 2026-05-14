import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [Navbar],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})

export class Productos implements OnInit{
  
  productos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  /*constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.obtenerProductos();
      }
    });

  }*/
  
  ngOnInit():void{


  /*obtenerProductos() {

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

}*/
    this.productos = this.route.snapshot.data['productos'];

    console.log('Productos cargados:', this.productos);
  }


// Asegúrate de cerrar bien el método anterior aquí arriba con una }

  agregarAlCarrito(producto: any) {
    // Obtener cliente guardado
    const cliente = JSON.parse(localStorage.getItem('cliente') || '{}');

    // Validar login
    if (!cliente.id_cliente) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos'
      });
      return;
    }

    // 1. Crear o verificar carrito
    this.http?.post<any>('http://localhost:3000/carrito', {
      id_cliente: cliente.id_cliente
    }).subscribe({
      next: (carrito: any) => {
        
        // 2. Agregar producto al detalle del carrito
        this.http?.post('http://localhost:3000/carrito/detalle', {
          id_carrito: carrito.id_carrito,
          id_producto: producto.id_producto, // Ahora sí reconocerá 'producto'
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
          error: (err: any) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo agregar al carrito'
            });
          }
        });
      },
      error: (err: any) => {
        console.error('Error al crear carrito', err);
      }
    });
  }

}
