import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartItems = new BehaviorSubject<any[]>([]);
    cartItems$ = this.cartItems.asObservable();

  // obtener valor actual
    getItems() {
    return this.cartItems.value;
    }

  // agregar producto
    addItem(producto: any) {

  const current = this.cartItems.value;

  const productoCarrito = {
    ...producto,
    cantidad: 1,
    subtotal: producto.precio
  };

  this.cartItems.next([...current, productoCarrito]);
}

  // limpiar carrito
    clearCart() {
    this.cartItems.next([]);
    }
}