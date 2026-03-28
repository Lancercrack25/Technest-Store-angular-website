import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { CarritoService } from '../services/user.service'; 

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './carrito.html',
  styleUrl: './carrito.css' 
})
export class Carrito implements OnInit {
  pagoExitoso: boolean = false;
  itemsCarrito: any[] = [];
  total: number = 0;
  
  idClientePrueba: number = 1; 

  // Inyectamos Location en el constructor
  constructor(
    private carritoService: CarritoService,
    private location: Location 
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.carritoService.obtenerCarrito(this.idClientePrueba).subscribe({
      next: (datosDelBackend) => {
        this.itemsCarrito = datosDelBackend;
        this.total = this.itemsCarrito.reduce((suma, item) => suma + Number(item.subtotal), 0);
      },
      error: (err) => {
        console.error('Error al cargar el carrito:', err);
      }
    });
  }

  //botton payment
  regresar() {
    this.location.back();
  }

    simularPago() {
    this.pagoExitoso = true;
  }

  reiniciarCarrito() {
    this.pagoExitoso = false;
    this.itemsCarrito = [];
    this.total = 0;
  }
}
