import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//servicio global de angular para manejar el estado del usuario en toda la aplicación, especialmente útil para el perfil del cliente
//no modifica nada en el backend, solo es para manejar el estado del usuario en el frontend y sincronizarlo con el backend cuando se cargue el perfil o se actualicen los datos

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<any>(this.getUser()); // ← carga al arrancar
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('cliente', JSON.stringify(user));
  }

  getUser() {
    const data = localStorage.getItem('cliente');
    return data ? JSON.parse(data) : null;
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.clear();
  }
}

//servicio para manejar el carrito de compras, se encarga de obtener los datos del carrito desde el backend y también de agregar productos al carrito
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  removeItem(id_producto: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/carrito'; 

  constructor(private http: HttpClient) { }

  obtenerCarrito(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idCliente}`);
  }

  agregarAlCarrito(idCliente: number, idProducto: string, cantidad: number, precioUnitario: number): Observable<any> {
    const body = {
      id_cliente: idCliente,
      id_producto: idProducto,
      cantidad: cantidad,
      precio_unitario: precioUnitario
    };
    return this.http.post(`${this.apiUrl}/agregar`, body);
  }
}

@Injectable({
  providedIn: 'root'
})
export class IaService {
  // La ruta de tu backend en Node
  private apiUrl = 'http://localhost:3000/api/validar';

  constructor(private http: HttpClient) { }

  validarCompatibilidad(piezas: any): Observable<any> {
    return this.http.post(this.apiUrl, piezas);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private carritoInicial: any[] = JSON.parse(
    localStorage.getItem('carrito') || '[]'
  );

  private cartItems = new BehaviorSubject<any[]>(this.carritoInicial);

  cartItems$ = this.cartItems.asObservable();

  constructor() {}

  getItems() {
    return this.cartItems.value;
  }

  addItem(producto: any) {

    const current = this.cartItems.value;

    const productoExistente = current.find(
      item => item.id_producto === producto.id_producto
    );

    if (productoExistente) {

      productoExistente.cantidad += 1;

      productoExistente.subtotal =
        productoExistente.cantidad * Number(productoExistente.precio);

    } else {

      current.push({
        ...producto,
        cantidad: 1,
        subtotal: Number(producto.precio)
      });

    }

    this.cartItems.next([...current]);

    localStorage.setItem(
      'carrito',
      JSON.stringify(this.cartItems.value)
    );

  }

  removeItem(id_producto: any) {

    const updated = this.cartItems.value.filter(
      item => item.id_producto !== id_producto
    );

    this.cartItems.next(updated);

    localStorage.setItem(
      'carrito',
      JSON.stringify(updated)
    );

  }

  clearCart() {

    this.cartItems.next([]);

    localStorage.removeItem('carrito');
  }
}

//en este archivo se podran manejar los services de diferentes componentes
