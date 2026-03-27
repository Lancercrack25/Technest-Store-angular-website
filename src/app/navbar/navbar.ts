import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbars',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  menuOpen = false;
  userImage: string = '';
  userName: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

 ngOnInit() {
  // BehaviorSubject emite el valor actual inmediatamente al suscribirse
  this.userService.user$.subscribe(user => {
    if (user) {
      this.userName = user.nombre;
      this.userImage = user.imagen || '';
    } else {
      // fallback: intentar leer directo de localStorage
      const local = this.userService.getUser();
      if (local) {
        this.userName = local.nombre;
        this.userImage = local.imagen || '';
      }
    }
  });
}

  goToPerfil() {
    const user = this.userService.getUser();

    if (user?.id_cliente) {
      this.router.navigate(['/cliente/perfil', user.id_cliente]);
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/']);
  }
}
