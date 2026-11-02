require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, 'ssr_tech.db');
const ADMIN_PASSWORD = process.env.SSR_ADMIN_PASSWORD || 'SSRTECH2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ssr-tech-local-session-key-change-before-publishing';
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const productosIniciales = [
  ['Ryzen 5 5600','Procesador',529000,'6 núcleos · socket AM4','https://capital.lv/media/magefan_blog/Datoru_komponentes.png'],
  ['Core i5-12400F','Procesador',649000,'6 núcleos · socket LGA1700','https://capital.lv/media/magefan_blog/Datoru_komponentes.png'],
  ['Ryzen 5 7600','Procesador',899000,'6 núcleos · socket AM5','https://capital.lv/media/magefan_blog/Datoru_komponentes.png'],
  ['RTX 4060 8 GB','Tarjeta gráfica',1499000,'Gaming Full HD · 8 GB VRAM','https://arkaiacorp.com/static/img/articulos/componentes-pc-gaming.webp'],
  ['Radeon RX 7600','Tarjeta gráfica',1399000,'Gaming Full HD · 8 GB VRAM','https://arkaiacorp.com/static/img/articulos/componentes-pc-gaming.webp'],
  ['RTX 4070 SUPER','Tarjeta gráfica',3299000,'Gaming 1440p · 12 GB VRAM','https://arkaiacorp.com/static/img/articulos/componentes-pc-gaming.webp'],
  ['RAM DDR4 16 GB','Memoria RAM',179000,'2 × 8 GB · 3200 MHz','https://www.digitaltrends.com/tachyon/2025/11/GPU-RAM-SSD-on-table.jpg?resize=1200%2C630'],
  ['RAM DDR5 32 GB','Memoria RAM',399000,'2 × 16 GB · 5600 MHz','https://www.digitaltrends.com/tachyon/2025/11/GPU-RAM-SSD-on-table.jpg?resize=1200%2C630'],
  ['Placa B550M','Placa madre',449000,'AM4 · DDR4 · Micro ATX','https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg'],
  ['Placa B650M','Placa madre',699000,'AM5 · DDR5 · Micro ATX','https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg'],
  ['SSD NVMe 1 TB','Almacenamiento',299000,'M.2 · estado sólido','https://www.digitaltrends.com/tachyon/2025/11/GPU-RAM-SSD-on-table.jpg?resize=1200%2C630'],
  ['SSD NVMe 2 TB','Almacenamiento',529000,'M.2 · estado sólido','https://www.digitaltrends.com/tachyon/2025/11/GPU-RAM-SSD-on-table.jpg?resize=1200%2C630'],
  ['Fuente 650 W Bronze','Fuente',319000,'80+ Bronze · ATX','https://mr-robot.ru/upload/medialibrary/d95/dvqcpsmj7wau1p2x4nl7n3qi7w1gzvio.jpeg'],
  ['Fuente 850 W Gold','Fuente',599000,'80+ Gold · modular','https://mr-robot.ru/upload/medialibrary/d95/dvqcpsmj7wau1p2x4nl7n3qi7w1gzvio.jpeg'],
  ['Gabinete Mid Tower','Gabinete',289000,'ATX · frontal ventilado','https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg'],
  ['Gabinete Mini Tower','Gabinete',249000,'Micro ATX · compacto','https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg'],
  ['Disipador por aire','Refrigeración',159000,'Torre · ventilador 120 mm','https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg'],
  ['Refrigeración líquida 240 mm','Refrigeración',399000,'Radiador doble · ARGB','https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg']
];

function prepararBase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL UNIQUE,
      tipo TEXT NOT NULL, precio INTEGER NOT NULL CHECK(precio >= 0),
      detalle TEXT NOT NULL DEFAULT '', icono TEXT DEFAULT '◇', imagen TEXT DEFAULT '', activo INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS configuraciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, email TEXT NOT NULL,
      presupuesto INTEGER DEFAULT 0, total INTEGER NOT NULL, fecha TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS configuracion_piezas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, configuracion_id INTEGER NOT NULL,
      producto_id INTEGER, nombre TEXT NOT NULL, precio INTEGER NOT NULL,
      FOREIGN KEY(configuracion_id) REFERENCES configuraciones(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS carrito_items (
      carrito_id TEXT NOT NULL, producto_id INTEGER NOT NULL, cantidad INTEGER NOT NULL CHECK(cantidad BETWEEN 1 AND 20),
      PRIMARY KEY(carrito_id, producto_id), FOREIGN KEY(producto_id) REFERENCES productos(id)
    );
    CREATE TABLE IF NOT EXISTS ordenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, email TEXT NOT NULL,
      telefono TEXT NOT NULL, direccion TEXT NOT NULL, total INTEGER NOT NULL, fecha TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS orden_piezas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, orden_id INTEGER NOT NULL, nombre TEXT NOT NULL,
      precio INTEGER NOT NULL, cantidad INTEGER NOT NULL,
      FOREIGN KEY(orden_id) REFERENCES ordenes(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS contactos (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, email TEXT NOT NULL,
      asunto TEXT NOT NULL, mensaje TEXT NOT NULL, fecha TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sesiones_admin (
      token_hash TEXT PRIMARY KEY, expira INTEGER NOT NULL
    );
  `);
  const cols = db.prepare('PRAGMA table_info(productos)').all().map(x => x.name);
  if (!cols.includes('imagen')) db.exec("ALTER TABLE productos ADD COLUMN imagen TEXT DEFAULT ''");
  if (!cols.includes('activo')) db.exec('ALTER TABLE productos ADD COLUMN activo INTEGER NOT NULL DEFAULT 1');
  if (!cols.includes('icono')) db.exec("ALTER TABLE productos ADD COLUMN icono TEXT DEFAULT '◇'");
  const insertar = db.prepare('INSERT OR IGNORE INTO productos(nombre,tipo,precio,detalle,icono,imagen,activo) VALUES(?,?,?,?,?,?,1)');
  const iconos = {'Procesador':'◈','Tarjeta gráfica':'▧','Memoria RAM':'▤','Placa madre':'▦','Almacenamiento':'▰','Fuente':'ϟ','Gabinete':'▣','Refrigeración':'❄'};
  const transaccion = db.transaction(() => productosIniciales.forEach(p => insertar.run(p[0],p[1],p[2],p[3],iconos[p[1]] || '◇',p[4])));
  transaccion();
  const imagenPorTipo = {
    'Procesador':'https://capital.lv/media/magefan_blog/Datoru_komponentes.png','Tarjeta gráfica':'https://arkaiacorp.com/static/img/articulos/componentes-pc-gaming.webp',
    'Memoria RAM':'https://www.digitaltrends.com/tachyon/2025/11/GPU-RAM-SSD-on-table.jpg?resize=1200%2C630','Placa madre':'https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg',
    'Almacenamiento':'https://www.digitaltrends.com/tachyon/2025/11/GPU-RAM-SSD-on-table.jpg?resize=1200%2C630','Fuente':'https://mr-robot.ru/upload/medialibrary/d95/dvqcpsmj7wau1p2x4nl7n3qi7w1gzvio.jpeg',
    'Gabinete':'https://arkaiacorp.com/static/img/articulos/componentes-pc-gaming.webp','Refrigeración':'https://www.elettromania.com/assets/uploads/gallery_20260503_082310_502955bf.jpeg'
  };
  const asignarImagen = db.prepare("UPDATE productos SET imagen=? WHERE tipo=?");
  Object.entries(imagenPorTipo).forEach(([tipo,imagen]) => asignarImagen.run(imagen,tipo));
}
prepararBase();
if (process.argv.includes('--init-db')) {
  console.log(`Base de datos lista: ${DB_PATH}`);
  process.exit(0);
}

app.disable('x-powered-by');
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use((req,res,next) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options','DENY');
  next();
});
app.use('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }));
app.use((req,res,next) => { if (req.path === '/admin.html') return res.redirect('/admin/login'); if (/(^|\/)(ssr_tech\.db(?:-(?:wal|shm))?|\.env(?:\..*)?|server\.js|app\.py|package(?:-lock)?\.json|README\.md|PRD\.md|specs\.md)$/i.test(req.path)) return res.sendStatus(404); next(); });
app.use(express.static(ROOT));

// Pagina principal de SSR TECH
app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT, 'paginas', 'index.html'));
});

function respuestaError(res, status, mensaje) { return res.status(status).json({ error: mensaje }); }
function texto(valor, max = 160) { return typeof valor === 'string' ? valor.trim().slice(0,max) : ''; }
function entero(valor, minimo = 0, maximo = 100000000) {
  const n = Number(valor);
  return Number.isSafeInteger(n) && n >= minimo && n <= maximo ? n : null;
}
function emailValido(valor) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor); }
function tokenHash(token) { return crypto.createHmac('sha256', SESSION_SECRET || 'local-session-secret-change-me').update(token).digest('hex'); }
function adminValido(req) {
  const token = req.cookiesToken || (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('ssr_admin='))?.slice(10);
  if (!token) return false;
  const hash = tokenHash(token);
  const sesion = db.prepare('SELECT expira FROM sesiones_admin WHERE token_hash=?').get(hash);
  if (!sesion || sesion.expira < Date.now()) {
    db.prepare('DELETE FROM sesiones_admin WHERE token_hash=?').run(hash);
    return false;
  }
  return true;
}
function requiereAdmin(req,res,next) { if (!adminValido(req)) return respuestaError(res,401,'Inicia sesión para continuar.'); next(); }
function productosPublicos() { return db.prepare('SELECT id,nombre,tipo,precio,detalle,icono,imagen FROM productos WHERE activo=1 ORDER BY tipo,nombre').all(); }
function carrito(cartId) {
  const items = db.prepare(`SELECT p.id,p.nombre,p.tipo,p.precio,p.detalle,p.icono,p.imagen,c.cantidad,
    (p.precio*c.cantidad) AS subtotal FROM carrito_items c JOIN productos p ON p.id=c.producto_id
    WHERE c.carrito_id=? AND p.activo=1 ORDER BY p.tipo,p.nombre`).all(cartId);
  return { articulos: items, cantidad: items.reduce((n,p) => n+p.cantidad,0), total: items.reduce((n,p) => n+p.subtotal,0) };
}
function cartIdDesde(req) {
  const id = texto(req.body?.cart_id || req.query.cart_id, 80);
  return /^[a-zA-Z0-9_-]{8,80}$/.test(id) ? id : '';
}

app.get('/api/productos', (req,res) => res.json(productosPublicos()));
app.get('/api/carrito', (req,res) => {
  const id = cartIdDesde(req);
  if (!id) return res.json({ articulos: [], cantidad: 0, total: 0 });
  res.json(carrito(id));
});
app.post('/api/carrito/:accion', (req,res) => {
  const cartId = cartIdDesde(req);
  if (!cartId) return respuestaError(res,400,'No se pudo identificar el carrito. Recarga la página.');
  const accion = req.params.accion;
  if (accion === 'comprar') {
    const nombre = texto(req.body.nombre,100), email = texto(req.body.email,160).toLowerCase();
    const telefono = texto(req.body.telefono,40), direccion = texto(req.body.direccion,250);
    if (nombre.length < 2 || !emailValido(email) || telefono.length < 7 || direccion.length < 5) return respuestaError(res,400,'Completa nombre, correo válido, teléfono y dirección.');
    const guardarPedido = db.transaction(() => {
      const lineas = db.prepare(`SELECT p.id,p.nombre,p.precio,c.cantidad FROM carrito_items c JOIN productos p ON p.id=c.producto_id WHERE c.carrito_id=? AND p.activo=1`).all(cartId);
      if (!lineas.length) throw new Error('EMPTY_CART');
      const total = lineas.reduce((s,p) => s + p.precio*p.cantidad,0);
      const pedido = db.prepare('INSERT INTO ordenes(nombre,email,telefono,direccion,total) VALUES(?,?,?,?,?)').run(nombre,email,telefono,direccion,total);
      const item = db.prepare('INSERT INTO orden_piezas(orden_id,nombre,precio,cantidad) VALUES(?,?,?,?)');
      lineas.forEach(p => item.run(pedido.lastInsertRowid,p.nombre,p.precio,p.cantidad));
      db.prepare('DELETE FROM carrito_items WHERE carrito_id=?').run(cartId);
      return { ok:true, orden: Number(pedido.lastInsertRowid), total };
    });
    try { return res.status(201).json(guardarPedido()); }
    catch (e) { if (e.message === 'EMPTY_CART') return respuestaError(res,400,'Tu carrito está vacío.'); throw e; }
  }
  if (accion === 'agregar') {
    const productoId = entero(req.body.producto_id,1), cantidad = entero(req.body.cantidad ?? 1,1,20);
    if (!productoId || !cantidad) return respuestaError(res,400,'Producto o cantidad no válidos.');
    if (!db.prepare('SELECT id FROM productos WHERE id=? AND activo=1').get(productoId)) return respuestaError(res,404,'No encontramos ese producto.');
    db.prepare(`INSERT INTO carrito_items(carrito_id,producto_id,cantidad) VALUES(?,?,?)
      ON CONFLICT(carrito_id,producto_id) DO UPDATE SET cantidad=MIN(carrito_items.cantidad+excluded.cantidad,20)`).run(cartId,productoId,cantidad);
    return res.json(carrito(cartId));
  }
  const productoId = entero(req.body.producto_id,1);
  if (!productoId) return respuestaError(res,400,'Producto no válido.');
  if (accion === 'cantidad') {
    const cantidad = entero(req.body.cantidad,1,20);
    if (!cantidad) return respuestaError(res,400,'La cantidad debe estar entre 1 y 20.');
    db.prepare('UPDATE carrito_items SET cantidad=? WHERE carrito_id=? AND producto_id=?').run(cantidad,cartId,productoId);
  } else if (accion === 'quitar') {
    db.prepare('DELETE FROM carrito_items WHERE carrito_id=? AND producto_id=?').run(cartId,productoId);
  } else return respuestaError(res,404,'Acción de carrito no encontrada.');
  res.json(carrito(cartId));
});

app.post('/api/configuraciones', (req,res) => {
  const nombre = texto(req.body.nombre,100), email = texto(req.body.email,160).toLowerCase();
  const presupuesto = entero(req.body.presupuesto || 0,0,100000000);
  const idsRaw = Array.isArray(req.body.productos) ? req.body.productos : [];
  const ids = [...new Set(idsRaw.map(x => entero(x,1)).filter(Boolean))];
  if (nombre.length < 2 || !emailValido(email) || presupuesto === null || !ids.length || ids.length !== idsRaw.length) return respuestaError(res,400,'Escribe tu nombre, un correo válido y elige al menos una pieza.');
  const piezas = ids.map(id => db.prepare('SELECT id,nombre,precio FROM productos WHERE id=? AND activo=1').get(id));
  if (piezas.some(p => !p)) return respuestaError(res,400,'Una pieza seleccionada ya no está disponible.');
  const total = piezas.reduce((s,p) => s+p.precio,0);
  const guardar = db.transaction(() => {
    const config = db.prepare('INSERT INTO configuraciones(nombre,email,presupuesto,total) VALUES(?,?,?,?)').run(nombre,email,presupuesto,total);
    const insertar = db.prepare('INSERT INTO configuracion_piezas(configuracion_id,producto_id,nombre,precio) VALUES(?,?,?,?)');
    piezas.forEach(p => insertar.run(config.lastInsertRowid,p.id,p.nombre,p.precio));
    return Number(config.lastInsertRowid);
  });
  res.status(201).json({ok:true,id:guardar(),total});
});

app.post('/api/contacto', (req,res) => {
  const nombre = texto(req.body.nombre,100), email = texto(req.body.email,160).toLowerCase();
  const asunto = texto(req.body.asunto,120), mensaje = texto(req.body.mensaje,2000);
  if (nombre.length < 2 || !emailValido(email) || asunto.length < 3 || mensaje.length < 10) return respuestaError(res,400,'Revisa los campos. El mensaje debe tener al menos 10 caracteres.');
  const result = db.prepare('INSERT INTO contactos(nombre,email,asunto,mensaje) VALUES(?,?,?,?)').run(nombre,email,asunto,mensaje);
  res.status(201).json({ok:true,id:Number(result.lastInsertRowid),mensaje:'Tu mensaje quedó registrado. Gracias por contactar a SSR TECH.'});
});

app.post('/api/admin/login', (req,res) => {
  
  const pass = typeof req.body.password === 'string' ? req.body.password : '';
  const esperado = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
  const recibido = crypto.createHash('sha256').update(pass).digest();
  if (!crypto.timingSafeEqual(esperado,recibido)) return respuestaError(res,401,'La contraseña no coincide.');
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sesiones_admin(token_hash,expira) VALUES(?,?)').run(tokenHash(token),Date.now()+8*60*60*1000);
  res.cookie('ssr_admin',token,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000,path:'/'});
  res.json({ok:true});
});
app.post('/api/admin/salir', (req,res) => {
  const token = (req.headers.cookie || '').split(';').map(s=>s.trim()).find(s=>s.startsWith('ssr_admin='))?.slice(10);
  if (token) db.prepare('DELETE FROM sesiones_admin WHERE token_hash=?').run(tokenHash(token));
  res.clearCookie('ssr_admin',{httpOnly:true,sameSite:'strict',path:'/'}).json({ok:true});
});
app.get('/api/admin/sesion', requiereAdmin, (req,res) => res.json({ok:true}));
app.get('/api/admin/ordenes', requiereAdmin, (req,res) => {
  const ordenes = db.prepare('SELECT * FROM ordenes ORDER BY id DESC').all();
  const items = db.prepare('SELECT nombre,precio,cantidad FROM orden_piezas WHERE orden_id=?');
  res.json(ordenes.map(o => ({...o,piezas:items.all(o.id)})));
});
app.get('/api/admin/configuraciones', requiereAdmin, (req,res) => {
  const configs = db.prepare('SELECT * FROM configuraciones ORDER BY id DESC').all();
  const items = db.prepare('SELECT nombre,precio FROM configuracion_piezas WHERE configuracion_id=?');
  res.json(configs.map(c => ({...c,piezas:items.all(c.id)})));
});
app.get('/api/admin/contactos', requiereAdmin, (req,res) => res.json(db.prepare('SELECT * FROM contactos ORDER BY id DESC').all()));
app.get('/api/admin/productos', requiereAdmin, (req,res) => res.json(db.prepare('SELECT * FROM productos ORDER BY tipo,nombre').all()));
app.post('/api/admin/productos', requiereAdmin, (req,res) => {
  const nombre = texto(req.body.nombre,100), tipo = texto(req.body.tipo,60), detalle = texto(req.body.detalle,240), precio = entero(req.body.precio,0,100000000);
  const imagen = texto(req.body.imagen,180);
  const tipos = ['Procesador','Tarjeta gráfica','Memoria RAM','Placa madre','Almacenamiento','Fuente','Gabinete','Refrigeración','Periférico'];
  if (nombre.length<2 || !tipos.includes(tipo) || precio===null || !detalle) return respuestaError(res,400,'Completa nombre, categoría, detalle y precio válido.');
  try { const r = db.prepare('INSERT INTO productos(nombre,tipo,precio,detalle,imagen,activo) VALUES(?,?,?,?,?,1)').run(nombre,tipo,precio,detalle,imagen); res.status(201).json({ok:true,id:Number(r.lastInsertRowid)}); }
  catch(e) { if (String(e.code).includes('CONSTRAINT')) return respuestaError(res,409,'Ya existe un producto con ese nombre.'); throw e; }
});
app.put('/api/admin/productos/:id', requiereAdmin, (req,res) => {
  const id = entero(req.params.id,1), nombre = texto(req.body.nombre,100), tipo = texto(req.body.tipo,60), detalle = texto(req.body.detalle,240), precio = entero(req.body.precio,0,100000000), imagen = texto(req.body.imagen,180);
  if (!id || nombre.length<2 || !tipo || precio===null || !detalle) return respuestaError(res,400,'Datos de producto no válidos.');
  const r = db.prepare('UPDATE productos SET nombre=?,tipo=?,precio=?,detalle=?,imagen=? WHERE id=?').run(nombre,tipo,precio,detalle,imagen,id);
  if (!r.changes) return respuestaError(res,404,'Producto no encontrado.'); res.json({ok:true});
});
app.delete('/api/admin/productos/:id', requiereAdmin, (req,res) => {
  const id = entero(req.params.id,1); if (!id) return respuestaError(res,400,'Producto no válido.');
  const r = db.prepare('UPDATE productos SET activo=0 WHERE id=?').run(id);
  if (!r.changes) return respuestaError(res,404,'Producto no encontrado.'); res.json({ok:true});
});

app.get(['/componentes','/componentes/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'componentes.html')));
app.get(['/configurar','/configurar/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'configurar.html')));
app.get(['/productos','/productos/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'productos.html')));
app.get(['/formulario','/formulario/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'formulario.html')));
app.get(['/presupuesto','/presupuesto/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'presupuesto.html')));
app.get(['/seleccion-componentes','/seleccion-componentes/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'componentes-seleccion.html')));
app.get(['/admin/login','/admin/login/'], (req,res) => res.sendFile(path.join(ROOT, 'paginas', 'admin-login.html')));
app.get(['/admin','/admin/'], (req,res,next) => { if (adminValido(req)) return res.sendFile(path.join(ROOT, 'paginas', 'admin.html')); res.redirect('/admin/login'); });
app.use((err,req,res,next) => { console.error(err); if (res.headersSent) return next(err); res.status(500).json({error:'Ocurrió un error interno. Intenta de nuevo.'}); });
app.listen(PORT, '127.0.0.1', () => {
  console.log(`SSR TECH está disponible en http://127.0.0.1:${PORT}`);
});
