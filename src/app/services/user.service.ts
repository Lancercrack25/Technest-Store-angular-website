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

  private api = 'http://localhost:3000';

  private carritoInicial: any[] = JSON.parse(
    localStorage.getItem('carrito') || '[]'
  );

  private cartItems = new BehaviorSubject<any[]>(this.carritoInicial);

  cartItems$ = this.cartItems.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // CARRITO LOCAL
  // =========================

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
        productoExistente.cantidad *
        Number(productoExistente.precio);

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

  // =========================
  // BACKEND
  // =========================
 crearVenta(data: any): Observable<any> {
  return this.http.post(`${this.api}/ventas`, data);
}

  obtenerPedidos(idCliente: any) {

    return this.http.get(
      `${this.api}/pedidos/${idCliente}`
    );

  }

  obtenerEnvios() {

    return this.http.get(
      `${this.api}/envios`
    );

  }

  cerrarCarrito(idCliente: number): Observable<any> {
  return this.http.put(`${this.api}/carrito/cerrar/${idCliente}`, {});
}

 limpiarCarrito(idCliente: number): Observable<any> {
  return this.http.delete(`${this.api}/carrito/limpiar/${idCliente}`);
}

}
//en este archivo se podran manejar los services de diferentes componentes