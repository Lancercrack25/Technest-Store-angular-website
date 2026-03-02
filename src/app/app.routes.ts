import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { AdminLogin } from './admin-login/admin-login';
import { AdminPanel } from './admin-panel/admin-panel';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'inicio', component: Inicio },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/panel', component: AdminPanel },
];
