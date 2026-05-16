import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/user.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {

  // =========================
  // ESTADOS
  // =========================
  pagoExitoso = false;
  facturacionCompletada = false;

  cliente: any;

  // =========================
  // PAGO
  // =========================
  nombreTitular = '';
  numeroTarjeta = '';
  vencimiento = '';
  cvv = '';

  // =========================
  // FACTURA
  // =========================
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

  // 🔥 SNAPSHOT PARA FACTURA (IMPORTANTE)
  itemsFactura: any[] = [];

  // =========================
  // CARRITO
  // =========================
  itemsCarrito: any[] = [];
  subtotal = 0;
  impuestos = 0;
  total = 0;

  constructor(
    private cartService: CartService,
    private location: Location
  ) {}

  ngOnInit(): void {

    this.cliente = JSON.parse(localStorage.getItem('cliente') || '{}');

    this.cartService.cartItems$.subscribe(data => {
      this.itemsCarrito = data || [];
      this.calcularTotales();
    });

    this.generarFolio();
  }

  // =========================
  // TOTALES
  // =========================
  calcularTotales() {

    this.subtotal = this.itemsCarrito.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );

    this.impuestos = Number((this.subtotal * 0.16).toFixed(2));
    this.total = Number((this.subtotal + this.impuestos).toFixed(2));
  }

  // =========================
  // ELIMINAR
  // =========================
  eliminarItem(id_producto: any) {
    this.cartService.removeItem(id_producto);
  }

  // =========================
  // IR A PAGO
  // =========================
  procederPago() {

    if (this.itemsCarrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    this.pagoExitoso = true;
  }

  // =========================
  // CONFIRMAR PAGO
  // =========================
  confirmarPago() {

    if (!this.nombreTitular || !this.numeroTarjeta || !this.vencimiento || !this.cvv) {
      alert('Completa los datos de pago');
      return;
    }

    // 🔥 SNAPSHOT ANTES DE LIMPIAR
    this.itemsFactura = structuredClone(this.itemsCarrito);

    const venta = {
      id_cliente: this.cliente.id_cliente,
      detalles: this.itemsFactura.map(i => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad
      })),
      metodo_pago: 'Tarjeta',
      direccion_envio: `${this.factura.calle}, ${this.factura.colonia}, ${this.factura.ciudad}, ${this.factura.estado}, CP ${this.factura.cp}`
    };

    this.cartService.crearVenta(venta).subscribe({
      next: () => {

        this.cartService.clearCart();

        this.itemsCarrito = [];
        this.calcularTotales();

        this.pagoExitoso = false;
        this.facturacionCompletada = true;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  // =========================
  // FACTURA
  // =========================
  generarFolio() {

    const fecha = new Date();

    this.factura.folio = Math.floor(Math.random() * 900000) + 100000;
    this.factura.serie = 'A';
    this.factura.fecha = fecha.toLocaleString('es-MX');
  }

  descargarFactura() {
    alert('Descargando factura...');
  }

  // =========================
  // RESET
  // =========================
  reiniciarCarrito() {

    this.pagoExitoso = false;
    this.facturacionCompletada = false;

    this.itemsCarrito = [];
    this.itemsFactura = [];

    this.cartService.clearCart();

    this.nombreTitular = '';
    this.numeroTarjeta = '';
    this.vencimiento = '';
    this.cvv = '';

    this.generarFolio();
    this.calcularTotales();
  }

  regresar() {
    this.location.back();
  }
}