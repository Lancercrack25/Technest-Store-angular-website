import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IaService } from '../services/user.service';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-recomendador',
  standalone: true,
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './recomendador.html',
  styleUrl: './recomendador.css',
})
export class Recomendador {
  private iaService = inject(IaService);
  private cd = inject(ChangeDetectorRef);

  hardware = { cpu: '', gpu: '', mobo: '', ram: '' };
  cargando = false;
  resultadoAnalisis: any = null;

  validarEnsamblaje() {
    if (!this.hardware.cpu || !this.hardware.gpu) return;

    this.cargando = true;
    this.resultadoAnalisis = null;
    this.cd.detectChanges();

    this.iaService.validarCompatibilidad(this.hardware).subscribe({
      next: (respuesta: any) => {
        console.log('📦 Paquete recibido:', respuesta);

        // EXTRACCIÓN ROBUSTA: Buscamos compatible, detalles y cuello_de_botella
        const d = respuesta.resultado ? respuesta.resultado : respuesta;

        this.resultadoAnalisis = {
          compatible: d.compatible ?? false,
          detalles: d.detalles || 'No se recibieron detalles del análisis.',
          cuello_de_botella: d.cuello_de_botella || 'Sin datos de rendimiento.'
        };

        this.cargando = false;
        this.cd.detectChanges(); // Fuerza el dibujo en pantalla
      },
      error: (err) => {
        console.error('❌ Error de red:', err);
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }
}