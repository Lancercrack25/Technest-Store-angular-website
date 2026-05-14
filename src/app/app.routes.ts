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
import { Ventas } from './ventas/ventas';
import { RegistroProductos } from './registro-productos/registro-productos';
import { RegistroProvedores } from './registro-provedores/registro-provedores';
import { Clientes } from './clientes/clientes';
import { Provedores } from './provedores/provedores';
import { BarraBusqueda } from './barra-busqueda/barra-busqueda';
import { MenuCategorias } from './menu-categorias/menu-categorias';
import { CategoriaRegistro } from './categoria-registro/categoria-registro';
import { Envios } from './envios/envios';
import { ProductosResolver } from './core/productos.resolver';

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
  { 
    path: 'productos',
    component: Productos,
    resolve: {
      productos: ProductosResolver
    }
  },
  
  { path: 'recomendador', component: Recomendador},
  { path: 'pedidos', component: Pedidos},
  { path: 'ventas', component: Ventas},
  { path: 'registro/productos', component: RegistroProductos},
  { path: 'registro/provedores', component: RegistroProvedores},
  { path: 'clientes', component: Clientes},
  { path: 'provedores', component: Provedores},
  { path: 'barra-busqueda', component: BarraBusqueda},
  { path: 'menu-categorias', component: MenuCategorias},
  { path: 'categoria-registro', component: CategoriaRegistro},
  { path: 'envios', component: Envios},
];
