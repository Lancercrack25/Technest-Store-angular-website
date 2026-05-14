import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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