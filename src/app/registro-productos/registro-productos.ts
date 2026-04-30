import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-productos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-productos.html',
  styleUrl: './registro-productos.css',
})
export class RegistroProductos implements OnInit {

  categorias: any[] = [];
  proveedores: any[] = [];
  imagenPreview: string = '';

  producto = {
    numero_de_serie: '',
    nombre: '',
    descripcion: '',
    precio: null,
    costo: null,
    garantia_meses: null,
    id_categoria: '',
    id_proveedor: '',
    imagen: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/categorias').subscribe((res: any) => {
      this.categorias = res;
    });
    this.http.get('http://localhost:3000/proveedores').subscribe((res: any) => {
      this.proveedores = res;
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 600;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        this.producto.imagen = compressed;
        this.imagenPreview = compressed;
        event.target.value = '';
      };
    };
    reader.readAsDataURL(file);
  }

  guardar() {
    if (!this.producto.nombre || !this.producto.precio || !this.producto.id_categoria || !this.producto.id_proveedor) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Nombre, precio, categoría y proveedor son obligatorios',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#e01178'
      });
      return;
    }

    this.http.post('http://localhost:3000/productos', this.producto)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Producto registrado!',
            text: 'El producto fue agregado correctamente',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#fff'
          }).then(() => {
            this.router.navigate(['/admin/panel']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.error || 'No se pudo registrar el producto',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#e01178'
          });
        }
      });
  }
}
