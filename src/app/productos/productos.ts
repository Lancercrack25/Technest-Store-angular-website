import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [Navbar],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {

}
