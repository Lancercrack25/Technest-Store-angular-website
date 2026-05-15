import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule,FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email: string = '';

  enviarRecuperacion(): void {

    const correo = this.email.trim();

    // Validar campo vacío
    if (!correo) {
      this.mostrarAlerta(
        'warning',
        'Correo no ingresado',
        'Debe ingresar un correo para recuperar su contraseña.'
      );
      return;
    }

    // Validar formato de correo
    if (!this.validarCorreo(correo)) {
      this.mostrarAlerta(
        'error',
        'Correo inválido',
        'Ingrese un correo electrónico válido.'
      );
      return;
    }

    // Simulación de envío
    this.mostrarAlerta(
      'success',
      'Correo enviado',
      'En unos momentos recibirá un enlace para recuperar su contraseña.'
    );

    // Limpiar input
    this.email = '';
  }

  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  mostrarAlerta(
    icono: 'success' | 'error' | 'warning',
    titulo: string,
    mensaje: string
  ): void {
    Swal.fire({
      icon: icono,
      title: titulo,
      text: mensaje,
      confirmButtonColor: '#3085d6',
    });
  }
}