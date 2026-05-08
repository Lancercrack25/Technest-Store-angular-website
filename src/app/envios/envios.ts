import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-envios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './envios.html',
  styleUrl: './envios.css',
})

export class Envios implements OnInit {

  envios: any[] = [];
  cargando: boolean = true;
  cargado: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('envios');
      if (cached) {
        this.envios = JSON.parse(cached);
        this.cargando = false;
        this.cargado = true;
      }
    }
    this.cargarEnvios();
  }

  cargarEnvios() {
    this.http.get('http://localhost:3000/envios')
      .subscribe({
        next: (res: any) => {
          this.envios = res;
          this.cargando = false;
          this.cargado = true;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('envios', JSON.stringify(res));
          }
        },
        error: () => {
          this.cargando = false;
          this.cargado = true;
        }
      });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
