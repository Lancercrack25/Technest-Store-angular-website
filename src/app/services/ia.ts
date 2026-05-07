import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
