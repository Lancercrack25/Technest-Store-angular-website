import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css'],
})
export class AdminPanel {

  constructor(private router: Router) {}

  salir() {
    localStorage.removeItem('admin');
    this.router.navigate(['/admin/login']);
  }
}