import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-mouses',
  standalone: true,
  imports: [Navbar],
  templateUrl: './mouses.html',
  styleUrl: './mouses.css',
})
export class Mouses {

}
