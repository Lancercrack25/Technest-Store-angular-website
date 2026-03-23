# Technest Store website

# Technest Store website
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
