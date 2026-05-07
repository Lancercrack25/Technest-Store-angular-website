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
import { Audifonos } from './audifonos/audifonos';
import { Cables } from './cables/cables';
import { Discos } from './discos/discos';
import { Disipadores } from './disipadores/disipadores';
import { Gabinetes } from './gabinetes/gabinetes';
import { Graficas} from './graficas/graficas';
import { Monitores } from './monitores/monitores';
import { Motherboards } from './motherboards/motherboards';
import { Mouses } from './mouses/mouses';
import { Procesadores } from './procesadores/procesadores';
import { Rams } from './rams/rams';
import { Teclados } from './teclados/teclados';
import { Clientes } from './clientes/clientes';
import { Provedores } from './provedores/provedores';
import { BarraBusqueda } from './barra-busqueda/barra-busqueda';
import { MenuCategorias } from './menu-categorias/menu-categorias';
import { CategoriaRegistro } from './categoria-registro/categoria-registro';
import { Envios } from './envios/envios';


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
  { path: 'pedidos', component: Pedidos},
  { path: 'ventas', component: Ventas},
  { path: 'registro/productos', component: RegistroProductos},
  { path: 'registro/provedores', component: RegistroProvedores},
  { path: 'audifonos', component: Audifonos},
  { path: 'cables', component: Cables},
  { path: 'discos', component: Discos},
  { path: 'disipadores', component: Disipadores},
  { path: 'gabinetes', component: Gabinetes},
  { path: 'graficas', component: Graficas},
  { path: 'monitores', component: Monitores},
  { path: 'motherboards', component: Motherboards},
  { path: 'mouses', component: Mouses},
  { path: 'procesadores', component: Procesadores},
  { path: 'rams', component: Rams},
  { path: 'teclados', component: Teclados},
  { path: 'clientes', component: Clientes},
  { path: 'provedores', component: Provedores},
  { path: 'barra-busqueda', component: BarraBusqueda},
  { path: 'menu-categorias', component: MenuCategorias},
  { path: 'categoria-registro', component: CategoriaRegistro},
  { path: 'envios', component: Envios},
];
