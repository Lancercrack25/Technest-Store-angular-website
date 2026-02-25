import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Registro } from '../registro/registro';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}
