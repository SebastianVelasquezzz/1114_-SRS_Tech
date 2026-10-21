# SSR TECH

Proyecto escolar para una tienda de componentes de computador.

## Carpetas y archivos

- `paginas/`: páginas HTML que ve el usuario.
- `estilos/`: colores, tamaños, espacios y diseño de las páginas.
- `scripts/`: JavaScript que hace funcionar los botones, el carrito y los formularios.
- `imagenes/`: imágenes de los componentes.
- `server.js`: servidor de Node.js y comunicación con la base de datos.
- `ssr_tech.db`: base de datos SQLite donde se guardan productos, carritos, pedidos y configuraciones.
- `package.json`: lista de paquetes necesarios para ejecutar el proyecto.
- `.env.example`: ejemplo de configuración. Si necesitas ajustes privados, copia este archivo como `.env`.

## Cómo iniciar

1. Abre esta carpeta en VS Code.
2. Abre la terminal dentro de esta carpeta.
3. Ejecuta `npm install` para instalar los paquetes.
4. Ejecuta `npm start` para iniciar el servidor.
5. Abre `http://localhost:3000`.

## Cómo está organizado el código

En `scripts/tienda.js` los nombres están escritos de forma sencilla:
- `cargarProductos`: muestra los productos.
- `mostrarCarrito`: actualiza el carrito y su total.
- `consultarServidor`: pide información al servidor.
- `mostrarPrecio`: muestra los precios en pesos colombianos.
- `abrirCarrito`: abre o cierra el panel.

En `server.js` están las rutas que conectan la página con SQLite. La base de datos se crea y prepara desde el servidor.

## Importante

No borres `ssr_tech.db` si quieres conservar los registros. Haz una copia de seguridad antes de cambiar la estructura de la base de datos. Este proyecto es para practicar en local; antes de publicarlo en internet hay que configurar de forma segura la contraseña del administrador.
