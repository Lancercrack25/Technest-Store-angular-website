import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CarritoService } from '../services/user.service'; 
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css' 
})
export class Carrito implements OnInit {
  pagoExitoso: boolean = false;
  facturacionCompletada: boolean = false;
  total: number = 0;
  subtotal: number = 0;
  impuestos: number = 0;

  cliente: any;
  
  


  // Campos del formulario de pago
  nombreTitular: string = '';
  numeroTarjeta: string = '';
  vencimiento: string = '';
  cvv: string = '';

  // Datos de facturación
  factura: any = {
    folio: '',
    serie: '',
    fecha: '',
    nombreCliente: '',
    rfc: '',
    email: '',
    telefono: '',
    calle: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: '',
    regimen: '',
    usoCfdi: '',
    metodoPago: '',
    formaPago: ''
  }; 

  // constructor
  constructor(
    private carritoService: CarritoService,
    private location: Location,
    private cartService: CartService
  ) {}

  itemsCarrito: any[] = [];
  
  ngOnInit(): void {

    this.cliente = JSON.parse(localStorage.getItem('cliente') || '{}');
    this.cartService.cartItems$.subscribe(data => {
      this.itemsCarrito = data;

      console.log('Carrito actializado',data);
    });
  

    console.log(this.cliente);

    this.cargarCarrito();

    this.generarFolio();
  }
  

  cargarCarrito() {
    this.carritoService.obtenerCarrito(this.cliente.id_cliente).subscribe({
    
      /*next: (datosDelBackend) => {
        this.itemsCarrito = datosDelBackend;
        this.subtotal = this.itemsCarrito.reduce((suma, item) => suma + Number(item.subtotal), 0);
        this.impuestos = this.subtotal * 0.16;
        this.total = this.subtotal + this.impuestos;
      },*/

    next: (datosDelBackend: any) => {

      console.log(datosDelBackend);

      this.itemsCarrito = [...datosDelBackend];

      this.subtotal = this.itemsCarrito.reduce(
        (suma, item) => suma + Number(item.subtotal),
        0
      );

      this.impuestos = this.subtotal * 0.16;

      this.total = this.subtotal + this.impuestos;

    },

      error: (err) => {
        console.error('Error al cargar el carrito:', err);
      }
    });
  }

  generarFolio() {
    const fecha = new Date();
    this.factura.folio = Math.floor(Math.random() * 900000) + 100000;
    this.factura.serie = 'A';
    this.factura.fecha = fecha.toLocaleDateString('es-MX') + ' ' + fecha.toLocaleTimeString('es-MX');
  }

  confirmarPago() {
    this.facturacionCompletada = true;
  }

  descargarFactura() {
    alert('Descargando factura XML y PDF...');
  }

  //botton payment
  regresar() {
    this.location.back();
  }

  simularPago() {
    console.log('Botón Pagar presionado');
    console.log('Nombre:', this.nombreTitular);
    console.log('Tarjeta:', this.numeroTarjeta);
    console.log('Vencimiento:', this.vencimiento);
    console.log('CVV:', this.cvv);

    this.pagoExitoso = true;
  }

  reiniciarCarrito() {
    this.pagoExitoso = false;
    this.facturacionCompletada = false;
    this.itemsCarrito = [];
    this.total = 0;
    this.subtotal = 0;
    this.impuestos = 0;

    // Limpiar formulario de pago
    this.nombreTitular = '';
    this.numeroTarjeta = '';
    this.vencimiento = '';
    this.cvv = '';

    // Limpiar datos de facturación
    this.factura = {
      folio: '',
      serie: '',
      fecha: '',
      nombreCliente: '',
      rfc: '',
      email: '',
      telefono: '',
      calle: '',
      colonia: '',
      ciudad: '',
      estado: '',
      cp: '',
      regimen: '',
      usoCfdi: '',
      metodoPago: '',
      formaPago: ''
    };

    this.generarFolio();
  }
}
