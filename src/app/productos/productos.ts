import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [Navbar],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  
  productos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerProductos();
}

  obtenerProductos() {

  this.http.get<any[]>('http://localhost:3000/productos')
    .subscribe({

      next: (data) => {
        this.productos = data;
        console.log(data);
      },

      error: (error) => {
        console.error(error);
      }

    });

}


}
