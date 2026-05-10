import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas implements OnInit {

  ventas: any[] = [];
  cargando: boolean = true;
  cargado: boolean = false;

  totalIngresos: number = 0;
  promedioVenta: number = 0;
  ventasCompletadas: number = 0;

  private graficaLinea: any;
  private graficaDona: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('ventas');
      if (cached) {
        this.ventas = JSON.parse(cached);
        this.calcularStats();
        this.cargando = false;
        this.cargado = true;
        setTimeout(() => this.crearGraficas(), 100);
      }
    }
    this.cargarVentas();
  }

  cargarVentas() {
    this.http.get('http://localhost:3000/ventas')
      .subscribe({
        next: (res: any) => {
          this.ventas = res;
          this.calcularStats();
          this.cargando = false;
          this.cargado = true;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('ventas', JSON.stringify(res));
          }
          setTimeout(() => this.crearGraficas(), 100);
        },
        error: () => {
          this.cargando = false;
          this.cargado = true;
        }
      });
  }

  calcularStats() {
    this.totalIngresos = this.ventas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0);
    this.promedioVenta = this.ventas.length ? this.totalIngresos / this.ventas.length : 0;
    this.ventasCompletadas = this.ventas.filter(v => v.estado === 'Completada').length;
  }

  crearGraficas() {
    this.crearGraficaLinea();
    this.crearGraficaDona();
  }

  crearGraficaLinea() {
    const canvas = document.getElementById('graficaLinea') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.graficaLinea) this.graficaLinea.destroy();

    // Agrupar ventas por fecha
    const porFecha: any = {};
    this.ventas.forEach(v => {
      const fecha = new Date(v.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
      porFecha[fecha] = (porFecha[fecha] || 0) + parseFloat(v.total || 0);
    });

    const labels = Object.keys(porFecha);
    const datos = Object.values(porFecha) as number[];

    this.graficaLinea = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ingresos ($)',
          data: datos,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.08)',
          borderWidth: 2,
          pointBackgroundColor: '#22d3ee',
          pointRadius: 5,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  crearGraficaDona() {
    const canvas = document.getElementById('graficaDona') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.graficaDona) this.graficaDona.destroy();

    const estados: any = {};
    this.ventas.forEach(v => {
      estados[v.estado] = (estados[v.estado] || 0) + 1;
    });

    this.graficaDona = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(estados),
        datasets: [{
          data: Object.values(estados),
          backgroundColor: ['rgba(74,222,128,0.8)', 'rgba(250,204,21,0.8)', 'rgba(248,113,113,0.8)', 'rgba(34,211,238,0.8)'],
          borderColor: '#0f172a',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#94a3b8' }, position: 'bottom' }
        }
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN'
    }).format(monto);
  }
}