import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/user.service';
import Swal from 'sweetalert2'; // <-- Importación lista

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
  // FACTURA (DATOS FISCALES)
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

  // SNAPSHOTS INMUTABLES PARA LA FACTURA
  itemsFactura: any[] = [];
  subtotalFactura = 0;
  impuestosFactura = 0;
  totalFactura = 0;

  // =========================
  // CARRITO DINÁMICO
  // =========================
  itemsCarrito: any[] = [];
  subtotal = 0;
  impuestos = 0;
  total = 0;

  constructor(
    private cartService: CartService,
    private location: Location,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cliente = JSON.parse(localStorage.getItem('cliente') || '{}');

    // Escucha permanente del carrito
    this.cartService.cartItems$.subscribe(data => {
      this.itemsCarrito = data || [];
      this.calcularTotales();
    });

    this.generarFolio();
  }

  // =========================
  // CALCULO DE TOTALES INTERNOS
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
  // ACCIONES
  // =========================
  eliminarItem(id_producto: any) {
    this.cartService.removeItem(id_producto);
  }

  procederPago() {
    if (this.itemsCarrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Escoge productos antes de proceder al pago.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    this.pagoExitoso = true;
  }

  // ===================================
  // CONFIRMAR PAGO (CON SWEETALERT2)
  // ===================================
  confirmarPago() {
    if (!this.nombreTitular || !this.numeroTarjeta || !this.vencimiento || !this.cvv) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los datos de tu tarjeta.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // 1. Congelamos los datos usando primitivos nativos de respaldo
    this.itemsFactura = structuredClone(this.itemsCarrito);
    this.subtotalFactura = this.subtotal;
    this.impuestosFactura = this.impuestos;
    this.totalFactura = this.total;

    // 2. Estructuramos el objeto venta
    const venta = {
      id_cliente: this.cliente.id_cliente,
      detalles: this.itemsFactura.map(i => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad
      })),
      metodo_pago: 'Tarjeta',
      direccion_envio: `${this.factura.calle || ''}, ${this.factura.colonia || ''}, ${this.factura.ciudad || ''}, ${this.factura.estado || ''}, CP ${this.factura.cp || ''}`
    };

    // 3. Enviamos al Backend
    this.cartService.crearVenta(venta).subscribe({
      next: () => {
        // 4. Cambiamos los estados de las vistas
        this.pagoExitoso = false;
        this.facturacionCompletada = true;

        // 5. Forzamos a Angular a renderizar el HTML de la factura
        this.cdr.detectChanges();

        // 6. 🔥 DISPARAR MENSAJE DEÉXITO CON SWEETALERT2
        Swal.fire({
          icon: 'success',
          title: '¡Pago Procesado!',
          text: 'Tu compra ha sido registrada y tu factura fue generada con éxito.',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Ver Factura'
        });

        // 7. Limpiamos el carrito local en diferido
        setTimeout(() => {
          this.cartService.clearCart();
          this.itemsCarrito = [];
          this.cdr.detectChanges();
        }, 100);
      },
      error: (err: any) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error de transacción',
          text: 'Hubo un problema al procesar la venta en el servidor.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  // =========================
  // CONTROL DE FACTURA
  // =========================
  generarFolio() {
    const fecha = new Date();
    this.factura.folio = Math.floor(Math.random() * 900000) + 100000;
    this.factura.serie = 'A';
    this.factura.fecha = fecha.toLocaleString('es-MX');
  }

  descargarFactura() {
    Swal.fire({
      icon: 'info',
      title: 'Descarga',
      text: 'Descargando archivos PDF y XML de la factura...',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // =========================
  // LIMPIEZA TOTAL POST-COMPRA
  // =========================
  reiniciarCarrito() {
    this.pagoExitoso = false;
    this.facturacionCompletada = false;

    this.itemsCarrito = [];
    this.itemsFactura = [];
    this.subtotalFactura = 0;
    this.impuestosFactura = 0;
    this.totalFactura = 0;

    this.cartService.clearCart();

    this.nombreTitular = '';
    this.numeroTarjeta = '';
    this.vencimiento = '';
    this.cvv = '';

    this.generarFolio();
    this.calcularTotales();
    this.cdr.detectChanges();
  }

  regresar() {
    this.location.back();
  }
}