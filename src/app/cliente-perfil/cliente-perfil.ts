import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cliente-perfil.html',
  styleUrl: './cliente-perfil.css',
})
export class ClientePerfil implements OnInit {

  user: any = null;
  userImage: string = '';
  idCliente: string | null = null;
  cargando: boolean = true; // ← agrega esto

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idCliente = params['id'];
      if (this.idCliente) {
        this.cargarPerfil(this.idCliente);
      }
    });
  }

cargarPerfil(id: string) {
  // ✅ muestra datos del localStorage INMEDIATAMENTE
  const cached = this.userService.getUser();
  if (cached) {
    this.user = cached;
    this.userImage = cached.imagen || '';
    this.cargando = false; // quita el skeleton de inmediato
  }

  // ✅ luego actualiza con datos frescos del servidor
  this.http.get(`http://localhost:3000/cliente/perfil/${id}`)
    .subscribe((res: any) => {
      this.user = res;
      this.userImage = res.imagen;
      this.userService.setUser(res);
      this.cargando = false;
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
      }).subscribe((res: any) => {
        this.userImage = res.imagen;
        this.user = { ...this.user, imagen: res.imagen };
        this.userService.setUser(this.user);
        event.target.value = '';
      });
    };

    reader.readAsDataURL(file);
  }
}