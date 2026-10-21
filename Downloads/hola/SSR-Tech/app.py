"""Servidor local para SSR TECH: páginas originales, configuraciones y panel privado."""
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs
from urllib.parse import unquote
import hashlib
import hmac
import json
import os
import secrets
import sqlite3

CARPETA = Path(__file__).parent
BASE = CARPETA / "ssr_tech.db"
CLAVE_ADMIN = os.environ.get("SSR_ADMIN_PASSWORD", "SSRadmin2026!")
SESIONES = set()
PRODUCTOS = [
    ("Ryzen 5 5600", "Procesador", 529000, "6 núcleos · socket AM4", "◈"),
    ("Core i5-12400F", "Procesador", 649000, "6 núcleos · socket LGA1700", "◈"),
    ("Ryzen 5 7600", "Procesador", 899000, "6 núcleos · socket AM5", "◈"),
    ("RTX 4060 8 GB", "Tarjeta gráfica", 1499000, "Gaming Full HD · 8 GB VRAM", "▧"),
    ("Radeon RX 7600", "Tarjeta gráfica", 1399000, "Gaming Full HD · 8 GB VRAM", "▧"),
    ("RTX 4070 SUPER", "Tarjeta gráfica", 3299000, "Gaming 1440p · 12 GB VRAM", "▧"),
    ("RAM DDR4 16 GB", "Memoria RAM", 179000, "2 × 8 GB · 3200 MHz", "▤"),
    ("RAM DDR5 32 GB", "Memoria RAM", 399000, "2 × 16 GB · 5600 MHz", "▤"),
    ("Placa B550M", "Placa madre", 449000, "AM4 · DDR4 · Micro ATX", "▦"),
    ("Placa B650M", "Placa madre", 699000, "AM5 · DDR5 · Micro ATX", "▦"),
    ("SSD NVMe 1 TB", "Almacenamiento", 299000, "M.2 · estado sólido", "▰"),
    ("SSD NVMe 2 TB", "Almacenamiento", 529000, "M.2 · estado sólido", "▰"),
    ("Fuente 650 W Bronze", "Fuente", 319000, "80+ Bronze · ATX", "ϟ"),
    ("Fuente 850 W Gold", "Fuente", 599000, "80+ Gold · modular", "ϟ"),
    ("Gabinete Mid Tower", "Gabinete", 289000, "ATX · frontal ventilado", "▣"),
    ("Gabinete Mini Tower", "Gabinete", 249000, "Micro ATX · compacto", "▣"),
    ("Disipador por aire", "Refrigeración", 159000, "Torre · ventilador 120 mm", "❄"),
    ("Refrigeración líquida 240 mm", "Refrigeración", 399000, "Radiador doble · ARGB", "❄"),
]

def preparar_base():
    with sqlite3.connect(BASE) as db:
        db.execute("CREATE TABLE IF NOT EXISTS productos(id INTEGER PRIMARY KEY,nombre TEXT UNIQUE,tipo TEXT,precio INTEGER,detalle TEXT,icono TEXT)")
        db.execute("CREATE TABLE IF NOT EXISTS configuraciones(id INTEGER PRIMARY KEY,nombre TEXT,email TEXT,presupuesto INTEGER,total INTEGER,fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        db.execute("CREATE TABLE IF NOT EXISTS configuracion_piezas(configuracion_id INTEGER,producto_id INTEGER,nombre TEXT,precio INTEGER)")
        db.execute("CREATE TABLE IF NOT EXISTS carrito_items(carrito_id TEXT,producto_id INTEGER,cantidad INTEGER,PRIMARY KEY(carrito_id,producto_id))")
        db.execute("CREATE TABLE IF NOT EXISTS ordenes(id INTEGER PRIMARY KEY,nombre TEXT,email TEXT,telefono TEXT,direccion TEXT,total INTEGER,fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        db.execute("CREATE TABLE IF NOT EXISTS orden_piezas(orden_id INTEGER,nombre TEXT,precio INTEGER,cantidad INTEGER)")
        db.executemany("INSERT OR IGNORE INTO productos(nombre,tipo,precio,detalle,icono) VALUES(?,?,?,?,?)", PRODUCTOS)

class Sitio(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(CARPETA), **kwargs)

    def enviar_json(self, dato, estado=200, cabeceras=None):
        cuerpo=json.dumps(dato,ensure_ascii=False).encode("utf-8")
        self.send_response(estado); self.send_header("Content-Type","application/json; charset=utf-8"); self.send_header("Content-Length",str(len(cuerpo)))
        for nombre,valor in (cabeceras or {}).items(): self.send_header(nombre,valor)
        self.end_headers(); self.wfile.write(cuerpo)

    def sesion(self):
        for cookie in self.headers.get("Cookie","").split(";"):
            if cookie.strip().startswith("ssr_admin="): return cookie.strip().split("=",1)[1]
        return ""

    def es_admin(self): return self.sesion() in SESIONES

    def carrito_actual(self):
        datos=parse_qs(self.path.partition("?")[2]); clave=datos.get("cart_id",[""])[0]
        # El carrito queda ligado a un identificador aleatorio guardado en el navegador.
        if not clave or len(clave)>80: clave="invitado"
        return self.carrito_por_clave(clave)

    def carrito_por_clave(self, clave):
        with sqlite3.connect(BASE) as db:
            db.row_factory=sqlite3.Row
            piezas=[dict(x) for x in db.execute("SELECT p.id,p.nombre,p.tipo,p.precio,p.detalle,p.icono,c.cantidad FROM carrito_items c JOIN productos p ON p.id=c.producto_id WHERE c.carrito_id=? ORDER BY p.tipo,p.nombre",(clave,))]
        return clave,piezas,sum(x["precio"]*x["cantidad"] for x in piezas)

    def do_GET(self):
        rutas={"/componentes":"componentes.html","/configurar":"configurar.html","/admin/login":"admin-login.html","/admin":"admin.html","/admin.html":"admin.html"}
        if self.path=="/api/productos":
            with sqlite3.connect(BASE) as db:
                db.row_factory=sqlite3.Row
                return self.enviar_json([dict(x) for x in db.execute("SELECT * FROM productos ORDER BY tipo,nombre")])
        if self.path=="/api/admin/configuraciones":
            if not self.es_admin(): return self.enviar_json({"error":"Acceso restringido."},401)
            with sqlite3.connect(BASE) as db:
                db.row_factory=sqlite3.Row
                configs=[dict(x) for x in db.execute("SELECT * FROM configuraciones ORDER BY id DESC")]
                for config in configs: config["piezas"]=[dict(x) for x in db.execute("SELECT nombre,precio FROM configuracion_piezas WHERE configuracion_id=?",(config["id"],))]
            return self.enviar_json(configs)
        if self.path.startswith("/api/carrito"):
            clave,piezas,total=self.carrito_actual()
            return self.enviar_json({"articulos":piezas,"total":total})
        if self.path=="/api/admin/ordenes":
            if not self.es_admin(): return self.enviar_json({"error":"Acceso restringido."},401)
            with sqlite3.connect(BASE) as db:
                db.row_factory=sqlite3.Row; ordenes=[dict(x) for x in db.execute("SELECT * FROM ordenes ORDER BY id DESC")]
                for orden in ordenes: orden["piezas"]=[dict(x) for x in db.execute("SELECT nombre,precio,cantidad FROM orden_piezas WHERE orden_id=?",(orden["id"],))]
            return self.enviar_json(ordenes)
        ruta=rutas.get(self.path)
        if ruta:
            if ruta=="admin.html" and not self.es_admin(): self.send_response(302); self.send_header("Location","/admin/login"); self.end_headers(); return
            self.path="/"+ruta
        return super().do_GET()

    def do_POST(self):
        largo=int(self.headers.get("Content-Length",0)); raw=self.rfile.read(largo).decode("utf-8")
        try: datos=json.loads(raw or "{}")
        except json.JSONDecodeError: return self.enviar_json({"error":"No pudimos leer los datos."},400)
        if self.path=="/api/admin/login":
            if not hmac.compare_digest(str(datos.get("password","")),CLAVE_ADMIN): return self.enviar_json({"error":"La contraseña no coincide."},401)
            token=secrets.token_urlsafe(32); SESIONES.add(token)
            return self.enviar_json({"ok":True},cabeceras={"Set-Cookie":f"ssr_admin={token}; HttpOnly; SameSite=Strict; Path=/"})
        if self.path=="/api/admin/salir":
            SESIONES.discard(self.sesion()); return self.enviar_json({"ok":True},cabeceras={"Set-Cookie":"ssr_admin=; Max-Age=0; HttpOnly; SameSite=Strict; Path=/"})
        if self.path.startswith("/api/carrito/"):
            clave=str(datos.get("cart_id", ""))[:80] or "invitado"
            try: producto_id=int(datos.get("producto_id",0)); cantidad=max(1,min(20,int(datos.get("cantidad",1))))
            except (ValueError,TypeError): return self.enviar_json({"error":"Revisa el producto y la cantidad."},400)
            if self.path=="/api/carrito/comprar":
                nombre=str(datos.get("nombre","")).strip()[:100]; email=str(datos.get("email","")).strip()[:160]
                telefono=str(datos.get("telefono","")).strip()[:40]; direccion=str(datos.get("direccion","")).strip()[:250]
                if not nombre or "@" not in email or not telefono or not direccion: return self.enviar_json({"error":"Completa nombre, correo, teléfono y dirección."},400)
                with sqlite3.connect(BASE) as db:
                    lineas=db.execute("SELECT p.nombre,p.precio,c.cantidad FROM carrito_items c JOIN productos p ON p.id=c.producto_id WHERE c.carrito_id=?",(clave,)).fetchall()
                    if not lineas: return self.enviar_json({"error":"Tu carrito está vacío."},400)
                    total=sum(x[1]*x[2] for x in lineas)
                    cursor=db.execute("INSERT INTO ordenes(nombre,email,telefono,direccion,total) VALUES(?,?,?,?,?)",(nombre,email,telefono,direccion,total))
                    db.executemany("INSERT INTO orden_piezas VALUES(?,?,?,?)",[(cursor.lastrowid,*fila) for fila in lineas])
                    db.execute("DELETE FROM carrito_items WHERE carrito_id=?",(clave,))
                return self.enviar_json({"ok":True,"orden":cursor.lastrowid,"total":total})
            with sqlite3.connect(BASE) as db:
                if not db.execute("SELECT 1 FROM productos WHERE id=?",(producto_id,)).fetchone(): return self.enviar_json({"error":"No encontramos ese producto."},404)
                if self.path=="/api/carrito/agregar": db.execute("INSERT INTO carrito_items VALUES(?,?,?) ON CONFLICT(carrito_id,producto_id) DO UPDATE SET cantidad=MIN(cantidad+excluded.cantidad,20)",(clave,producto_id,cantidad))
                elif self.path=="/api/carrito/cantidad": db.execute("UPDATE carrito_items SET cantidad=? WHERE carrito_id=? AND producto_id=?",(cantidad,clave,producto_id))
                elif self.path=="/api/carrito/quitar": db.execute("DELETE FROM carrito_items WHERE carrito_id=? AND producto_id=?",(clave,producto_id))
                else: return self.enviar_json({"error":"Ruta del carrito no encontrada."},404)
            _,piezas,total=self.carrito_por_clave(clave)
            return self.enviar_json({"articulos":piezas,"total":total})
        if self.path=="/api/configuraciones":
            try: ids=list(dict.fromkeys(int(x) for x in datos.get("productos",[])))
            except (ValueError,TypeError): return self.enviar_json({"error":"Revisa las piezas elegidas."},400)
            nombre=str(datos.get("nombre","")).strip()[:100]; email=str(datos.get("email","")).strip()[:160]
            if not nombre or "@" not in email or not ids: return self.enviar_json({"error":"Escribe tu nombre, un correo válido y elige al menos una pieza."},400)
            with sqlite3.connect(BASE) as db:
                piezas=[]
                for pid in ids:
                    fila=db.execute("SELECT id,nombre,precio FROM productos WHERE id=?",(pid,)).fetchone()
                    if fila: piezas.append(fila)
                if len(piezas)!=len(ids): return self.enviar_json({"error":"Una pieza seleccionada ya no está disponible."},400)
                total=sum(x[2] for x in piezas)
                cursor=db.execute("INSERT INTO configuraciones(nombre,email,presupuesto,total) VALUES(?,?,?,?)",(nombre,email,int(datos.get("presupuesto") or 0),total))
                db.executemany("INSERT INTO configuracion_piezas VALUES(?,?,?,?)",[(cursor.lastrowid,x[0],x[1],x[2]) for x in piezas])
            return self.enviar_json({"ok":True,"id":cursor.lastrowid,"total":total})
        return self.enviar_json({"error":"Ruta no encontrada."},404)

if __name__=="__main__":
    preparar_base(); print("SSR TECH disponible en http://127.0.0.1:8000"); print("Contraseña inicial del admin: SSRadmin2026!")
    HTTPServer(("127.0.0.1",8000),Sitio).serve_forever()
