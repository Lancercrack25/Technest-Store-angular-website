import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './cliente-perfil.html',
  styleUrl: './cliente-perfil.css',
})
export class ClientePerfil {

  user: any = {};
  userImage: string = '';
  idCliente: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private userService: UserService
  ) {

    this.route.params.subscribe(params => {
      this.idCliente = params['id'];

      if (!this.idCliente) return;

      this.cargarPerfil(this.idCliente);
    });
  }

  cargarPerfil(id: string) {

    this.http.get(`http://localhost:3000/cliente/perfil/${id}`)
      .subscribe((res: any) => {

        this.user = res;
        this.userImage = res.imagen || 'assets/default-user.png';

        // sincronizar global
        this.userService.setUser(res);
      });
  }

  guardarCambios() {

    if (!this.idCliente) return;

    this.http.put(`http://localhost:3000/cliente/${this.idCliente}`, this.user)
      .subscribe((res: any) => {

        this.user = res;
        this.userService.setUser(res);

        alert('Datos actualizados');
      });
  }

  onImageSelected(event: any) {

    const file = event.target.files[0];
    if (!file || !this.idCliente) return;

    const reader = new FileReader();

    reader.onload = () => {

      const base64 = reader.result as string;

      this.http.put(`http://localhost:3000/cliente/imagen/${this.idCliente}`, {
        imagen: base64
      }).subscribe(() => {

        this.userImage = base64;

        const updatedUser = {
          ...this.user,
          imagen: base64
        };

        this.userService.setUser(updatedUser);
      });
    };

    reader.readAsDataURL(file);
  }
}