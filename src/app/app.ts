import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { IaService } from './services/ia'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  hardware = { cpu: '', gpu: '', mobo: '' };
  
  resultadoIA: string = ''; // Aquí guardaremos la respuesta
  cargando: boolean = false; // Para mostrar un mensaje de "Procesando..."

  constructor(private iaService: IaService) {}

  executeAnalysis() {
    this.cargando = true;
    this.resultadoIA = '';

    this.iaService.validarCompatibilidad(this.hardware).subscribe({
      next: (res) => {
  
  let textoFormateado = res.respuesta;
  
  textoFormateado = textoFormateado.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  textoFormateado = textoFormateado.replace(/\* /g, '<br><br>• ');

  this.resultadoIA = textoFormateado;
  this.cargando = false;
},
      error: (err) => {
        console.error(err);
        this.resultadoIA = "ERROR_DE_CONEXIÓN: El cerebro de TechNest no responde.";
        this.cargando = false;
      }
    });
  }
}