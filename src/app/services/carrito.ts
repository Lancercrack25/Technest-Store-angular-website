import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
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