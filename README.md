# Technest Store website
<img width="1936" height="960" alt="image" src="https://github.com/user-attachments/assets/06aabf0d-9242-44a5-a351-f813450a9fcb" />

Tienda en línea especializada en hardware y componentes de alto rendimiento para computadoras. Construida con Angular en el frontend y Node.js + PostgreSQL en el backend.

---

## 🚀 Instalación

### Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- Angular CLI 17+

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/technest-store.git
cd technest-store
```
Crea un archivo `.env` en la carpeta `Backend` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
AD_NAME=NombreAdmin
AD_PASSWORD=tu_password_admin
PORT=3000
```
El backend corre en `http://localhost:3000` y crea las tablas automáticamente al iniciar.
La aplicación abre en `http://localhost:4200`.

## 🗂️ Estructura del Proyecto

```
technest-store/
├── Backend/
│   ├── server.js         # Servidor Express y endpoints REST
│   ├── db.js             # Configuración de conexión a PostgreSQL
│   ├── init.js           # Creación automática de tablas
│   └── .env              # Variables de entorno (no subir a git)
├── src/
│   └── app/
│       ├── login/
│       ├── registro/
│       ├── forgot-password/
│       ├── inicio/
│       ├── navbar/
│       ├── footer/
│       ├── productos/
│       ├── carrito/
│       ├── recomendador/
│       ├── pedidos/
│       ├── cliente-perfil/
│       ├── admin-login/
│       ├── admin-panel/
│       ├── registro-productos/
│       ├── registro-provedores/
│       ├── categoria-registro/
│       ├── provedores/
│       ├── clientes/
│       └── ventas/
└── README.md
```

---

## 📱 Secciones del Cliente

### Autenticación

https://github.com/user-attachments/assets/45880ea9-a7b9-4253-8955-29c838e06b83

- **Login** — Inicio de sesión con nombre de usuario y contraseña. Incluye acceso rápido al panel admin con `Ctrl + L`.
- **Registro** — Formulario para crear una nueva cuenta de cliente.
- **¿Olvidaste tu cuenta?** — Sección para recuperación de acceso.

### Una vez logueado

https://github.com/user-attachments/assets/8a18506d-a8fb-4d45-b794-62bd9b330812

- **Inicio** — Página principal con información de la tienda y categorías destacadas.

- **Navbar** — Barra de navegación fija con acceso a:
  - Productos
  - Carrito
  - Recomendador de Piezas
  - Mis Pedidos
  - Foto de perfil con menú desplegable

- **Productos** — Catálogo completo de productos disponibles con imagen, precio y descripción.

- **Carrito** — Gestión de productos seleccionados antes de comprar.

- **Recomendador de Piezas** — Herramienta impulsada por IA (Gemini) para recomendar componentes según las necesidades del usuario.

- **Mis Pedidos** — Historial de compras realizadas por el cliente.

- **Perfil** — Sección accesible desde la foto del navbar donde el cliente puede:
  - Ver y editar sus datos personales (nombre, email, teléfono)
  - Cambiar su foto de perfil
  - Cerrar sesión

---

## 🔐 Panel de Administración

https://github.com/user-attachments/assets/b3c83432-6475-4962-b941-6193ecc9b86e

### Acceso
El panel admin se accede desde `/admin/login`. Las credenciales se configuran en el archivo `.env` del backend con las variables `AD_NAME` y `AD_PASSWORD`.

### Secciones del Panel

- **Registro de Productos** — Formulario para agregar nuevos productos al catálogo con nombre, precio, costo, descripción, garantía, categoría, proveedor e imagen.

- **Registro de Proveedores** — Alta de nuevos proveedores con razón social, RFC, contacto, email y teléfono.

- **Registro de Categorías** — Creación de categorías para organizar los productos del catálogo.

- **Ver Proveedores** — Tabla con todos los proveedores registrados, con opción de eliminar.

- **Ver Clientes** — Lista completa de clientes registrados en el sistema con opción de eliminar.

- **Ver Pedidos** — Historial de todos los pedidos realizados en la tienda.

- **Ver Ventas** — Registro de todas las ventas con detalles de monto, estado y método de pago.

- **Salir** — Cierra la sesión del administrador y regresa al login.

---

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con las siguientes tablas principales:

| Tabla | Descripción |
|-------|-------------|
| `cliente` | Clientes registrados |
| `categoria` | Categorías de productos |
| `proveedor` | Proveedores del sistema |
| `producto` | Catálogo de productos |
| `carrito` | Carritos activos |
| `carrito_detalle` | Productos en el carrito |
| `venta` | Ventas realizadas |
| `detalle_venta` | Productos por venta |
| `pago` | Pagos registrados |
| `envio` | Información de envíos |
| `factura` | Facturas generadas |

---

## 🛠️ Tecnologías

| Área | Tecnología |
|------|-----------|
| Frontend | Angular 17+ |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Estilos | CSS personalizado |
| Alertas | SweetAlert2 |
| IA | Google Gemini API |

---

## 📝 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL (default 5432) |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `AD_NAME` | Nombre del administrador |
| `AD_PASSWORD` | Contraseña del administrador |
| `PORT` | Puerto del backend (default 3000) |
| `GEMINI_API_KEY` | Clave de la API de Google Gemini |

---

## ⚠️ Notas importantes

- El archivo `.env` nunca debe subirse al repositorio. Agrégalo al `.gitignore`.
- Las tablas se crean automáticamente al iniciar el backend por primera vez.
- La imagen de perfil y de productos se almacena en base64 directamente en PostgreSQL.

<h2 style="font-size: 36px; margin-top: 40px;">Instalación</h2>

<strong>Para poder instalar correctamente este proyecto debes de tener instalado node.js, npm y angular</strong>
<a href ="https://youtu.be/TPHxJQCQ0lE?si=nNOVht3StsGYTTSv"> accede aqui para intsalar node.js y npm</a>

<strong>Una vez hecha la instalacion deberas abrir una terminal cmd con permisos de administrador y ejecutar el sigiente comando </strong>
<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
npm install -g @angular/cli
</pre>

<strong>Ahora si estas utlizando linux se recomienda instalar el repositorio oficial de Node.js (recomendado para distribuciones como Debian, Ubuntu y derivados)</strong>
  1. Actualiza la lista de paquetes
     
     <pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
      sudo apt update   
      </pre>
      
  2. Instala los paquetes necesarios para añadir repositorios externos:
     
     <pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
      sudo apt install curl software-properties-common     
      </pre>

  3. Añade el repositorio oficial de Node.js (por ejemplo, para la versión LTS 18.x):
     
      <pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -      
      </pre>
      
  4. Instala Node.js y npm:

      <pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
          sudo apt install -y nodejs   
      </pre>

  5. Verifica la instalacion:
      <pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
          node -v
          npm -v    
      </pre>
  6. Finalmente instala angular con:
        <pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
         npm install -g @angular/cli    
        </pre>
     

<strong>Listo, ya solamente debes de clonar este repositorio para poder usar este proyecto</strong>

<h2 style="font-size: 36px; margin-top: 40px;">¿Como ejecuto el proyecto?</h2>

Para la ejecucion de este proyecto desde windows deberas abrir dos terminales shell las cuales ejecutaran individualmente el backend y el front-end

En caso de estar usando linux simplemente accede a la ruta donde guardaste el proyecto ya sea por la terminal o por la misma terminal de Vscode 

En la primer terminal debes de ejecutar lo siguiente:

<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
cd backend
</pre>

y luego una vez accedido a la carpeta del backend ejecuta:

<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
node server.js
</pre>

En la segunda terminal no debes de acceder a ninguna otra carpeta simplemente ejecuta:
<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
ng serve -o
</pre>

Te pedira unas cuantas cosas la primera vez que ejecutas este comando solo debes de decirle que no en la terminal y asi despues se ejecutara la interfaz y automaticamente te redirigira en tu navegador a la interfaz

**Nota importante**: (Solo para windows) si al ejecutar ng serve -o no te deja deberas de ejecutar desde una terminal shell y con permisos de administrador lo siguiente:
<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
Set-ExecutionPolicy RemoteSigned
</pre>

Cuando te pregunte: Do you want to change the execution policy? [Y/N]

escribe Y preciona Enter.

Qué hace:

**Set-ExecutionPolicy:** Cambia la política de ejecución de PowerShell, que controla qué scripts se pueden ejecutar en tu sistema.

**RemoteSigned:** Es un nivel de seguridad que permite:
**Ejecutar scripts locales** (los que tú creas) sin restricciones.

**Ejecutar scripts descargados** de Internet solo si están firmados digitalmente por un editor confiable.

**Ejecutar scripts locales** (los que tú creas) sin restricciones.

  Esto evita que scripts maliciosos descargados desde Internet se ejecuten automáticamente

**Segunda nota importante**:en el caso de clonar este repositorio y que te marque error al querer ejecutar el poryecto ya sea desde el front end deberas ejecuar el siguiente comando:
<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
npm install
</pre>

en caso de que el backend no este funcionando deberas acceder primero a la carpeta backend y despues una vez dentro de la carpeta deberas ejecutar lo siguiente:
<pre style="background:#f5f5f5; padding: 10px; border-radius: 5px;">
npm install pg dotenv
</pre>
