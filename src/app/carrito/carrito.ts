import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/user.service';

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
  loadingPago: boolean = false;

  cliente: any = {};

  nombreTitular = '';
  numeroTarjeta = '';
  vencimiento = '';
  cvv = '';

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

  itemsCarrito: any[] = [];

  subtotal = 0;
  impuestos = 0;
  total = 0;

  constructor(
    private carritoService: CarritoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cliente = JSON.parse(localStorage.getItem('cliente') || '{}');

    this.generarFolio();
    this.cargarCarrito();
  }

  // ================= CARRITO =================

  cargarCarrito() {
    this.carritoService.obtenerCarrito(this.cliente.id_cliente).subscribe({
      next: (data: any) => {
        this.itemsCarrito = data || [];
        this.calcularTotales();
      },
      error: (err) => console.error(err)
    });
  }

  eliminarItem(id_producto: any) {
    this.carritoService.removeItem(id_producto);

    // 🔥 recargar después de eliminar
    setTimeout(() => this.cargarCarrito(), 200);
  }

  calcularTotales() {
    this.subtotal = this.itemsCarrito.reduce(
      (acc, i) => acc + Number(i.subtotal),
      0
    );

    this.impuestos = Number((this.subtotal * 0.16).toFixed(2));
    this.total = Number((this.subtotal + this.impuestos).toFixed(2));
  }

  // ================= UI =================

  mostrarFormularioPago() {
    if (!this.itemsCarrito.length) {
      alert('Carrito vacío');
      return;
    }
    this.pagoExitoso = true;
  }

  regresar() {
    this.location.back();
  }

  generarFolio() {
    const f = new Date();
    this.factura.folio = Math.floor(Math.random() * 900000) + 100000;
    this.factura.serie = 'A';
    this.factura.fecha = f.toLocaleString('es-MX');
  }

  descargarFactura() {
    // 🔥 SIMULACIÓN SIMPLE (sin librerías)
    const data = {
      cliente: this.factura.nombreCliente,
      total: this.total,
      items: this.itemsCarrito
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${this.factura.folio}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  reiniciarCarrito() {
    this.pagoExitoso = false;
    this.facturacionCompletada = false;
    this.itemsCarrito = [];
    this.subtotal = 0;
    this.impuestos = 0;
    this.total = 0;

    this.generarFolio();
  }

  // ================= PAGO =================

  confirmarPago() {

    if (this.loadingPago) return;

    if (!this.nombreTitular || !this.numeroTarjeta || !this.vencimiento || !this.cvv) {
      alert('Completa los datos de tarjeta');
      return;
    }

    if (!this.itemsCarrito.length) return;

    this.loadingPago = true;

    const payload = {
      id_cliente: this.cliente.id_cliente,
      detalles: this.itemsCarrito.map(i => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad
      })),
      metodo_pago: 'Tarjeta de crédito',
      direccion_envio: this.factura.calle || 'Sin dirección'
    };

    fetch('http://localhost:3000/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {

        if (data.ok) {
          this.facturacionCompletada = true;
          this.pagoExitoso = false;
          this.itemsCarrito = [];
          this.total = 0;
        } else {
          alert(data.error || 'Error en pago');
        }

      })
      .catch(err => {
        console.error(err);
        alert('Error de conexión');
      })
      .finally(() => {
        this.loadingPago = false;
      });
  }
}