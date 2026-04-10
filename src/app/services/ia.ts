import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  // Dirección de tu servidor de Node.js (Issue #23)
  private apiUrl = 'http://localhost:3000/api/validar';

  constructor(private http: HttpClient) { }

  // Función para enviar las piezas (CPU, GPU, MOBO) a la IA
  validarCompatibilidad(piezas: any): Observable<any> {
    return this.http.post(this.apiUrl, piezas);
  }
}