import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { AdminLogin } from './admin-login/admin-login';
import { AdminPanel } from './admin-panel/admin-panel';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { AdminPerfil } from './admin-perfil/admin-perfil';
import { ClientePerfil} from './cliente-perfil/cliente-perfil';
import { Carrito  } from './carrito/carrito';
import { Productos } from './productos/productos';
import { Recomendador } from './recomendador/recomendador';
import { Pedidos } from './pedidos/pedidos';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'inicio', component: Inicio },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/panel', component: AdminPanel },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'navbar', component: Navbar },
  { path: 'footer', component: Footer },
  { path: 'admin/perfil', component: AdminPerfil },
  { path: 'cliente/perfil/:id', component: ClientePerfil },
  { path: 'carrito', component: Carrito},
  { path: 'productos', component: Productos},
  { path: 'recomendador', component: Recomendador},
  { path: 'pedidos', component: Pedidos}
];
