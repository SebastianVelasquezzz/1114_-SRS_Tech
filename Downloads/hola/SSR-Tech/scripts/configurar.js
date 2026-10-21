const grupos=['Procesador','Tarjeta gráfica','Memoria RAM','Placa madre','Almacenamiento','Fuente','Gabinete','Refrigeración'];
let productos=[];
const cop=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(n)||0);
const seguro=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const porTipo=tipo=>productos.filter(p=>p.tipo===tipo).sort((a,b)=>a.precio-b.precio);
const datoPresupuesto=()=>Number(document.querySelector('#presupuesto-config').value)||0;
function piezaCompatible(tipo, cpu, placa){
 const lista=porTipo(tipo);
 if(tipo==='Placa madre' && cpu){const socket=(cpu.detalle.match(/socket\s+([A-Z0-9]+)/i)||[])[1];return lista.find(p=>!socket||p.detalle.toLowerCase().includes(socket.toLowerCase()))||lista[0]}
 if(tipo==='Memoria RAM' && placa){const ddr=(placa.detalle.match(/DDR[45]/i)||[])[0];return lista.find(p=>!ddr||p.detalle.toUpperCase().includes(ddr.toUpperCase()))||lista[0]}
 return lista[0];
}
async function cargar(){
 const destino=document.querySelector('#selectores');
 const presupuestoInicial=new URLSearchParams(location.search).get('presupuesto');
 if(presupuestoInicial)document.querySelector('#presupuesto-config').value=presupuestoInicial;
 try{
  const respuesta=await fetch('/api/productos');productos=await respuesta.json();
  if(!respuesta.ok)throw Error(productos.error||'No se pudieron cargar los productos.');
  destino.innerHTML=grupos.map((g,i)=>`<section class="seccion selector-card"><span class="selector-numero">0${i+1}</span><h2>${seguro(g)}</h2><div class="campo-pc"><label for="pieza-${i}">Componente disponible</label><select id="pieza-${i}" name="pieza" data-grupo="${seguro(g)}"><option value="">No incluir</option>${productos.filter(p=>p.tipo===g).map(p=>`<option value="${Number(p.id)}">${seguro(p.nombre)} · ${cop(p.precio)}</option>`).join('')}</select></div><p class="detalle-selector">${seguro((productos.find(p=>p.tipo===g)||{}).detalle||'Elige una opción del catálogo.')}</p></section>`).join('');
  destino.addEventListener('change',()=>{actualizar();document.querySelector('#estado-presupuesto').textContent='Configuración modificada manualmente.'});
  document.querySelector('#config-form').addEventListener('submit',guardar);
  document.querySelector('#auto-armar').addEventListener('click',armarPorPresupuesto);
  document.querySelector('#presupuesto-config').addEventListener('change',()=>{document.querySelector('#presupuesto-resumen').textContent=datoPresupuesto()?cop(datoPresupuesto()):'Sin definir'});
  actualizar();
  if(presupuestoInicial)armarPorPresupuesto();
 }catch(e){destino.innerHTML=`<p role="alert">${seguro(e.message)} Enciende el servidor e inténtalo de nuevo.</p>`}
}
function seleccionActual(){return [...document.querySelectorAll('[name="pieza"]')].map(x=>Number(x.value)).filter(Boolean)}
function actualizar(){const ids=seleccionActual();const elegidos=ids.map(id=>productos.find(p=>p.id===id)).filter(Boolean);const total=elegidos.reduce((s,p)=>s+p.precio,0);document.querySelector('#cuenta').textContent=elegidos.length;document.querySelector('#total').textContent=cop(total);document.querySelector('#presupuesto-resumen').textContent=datoPresupuesto()?cop(datoPresupuesto()):'Sin definir';const diferencia=datoPresupuesto()-total;document.querySelector('#estado-presupuesto').textContent=datoPresupuesto()?(diferencia>=0?`Te quedan ${cop(diferencia)} disponibles.`:`Te pasas del presupuesto por ${cop(Math.abs(diferencia))}.`):'Escribe un presupuesto para calcular una sugerencia.'}
function armarPorPresupuesto(){
 const presupuesto=datoPresupuesto(),aviso=document.querySelector('#estado-presupuesto');
 if(!Number.isSafeInteger(presupuesto)||presupuesto<1){aviso.textContent='Escribe un presupuesto válido en pesos colombianos.';return}
 const selects=[...document.querySelectorAll('[name="pieza"]')];selects.forEach(s=>s.value='');
 const elegidos=[];let total=0;
 const agregar=p=>{if(p&&!elegidos.some(x=>x.id===p.id)&&total+p.precio<=presupuesto){elegidos.push(p);total+=p.precio;return true}return false};
 const cpu=piezaCompatible('Procesador');agregar(cpu);
 const placa=piezaCompatible('Placa madre',cpu);agregar(placa);
 const ram=piezaCompatible('Memoria RAM',cpu,placa);agregar(ram);
 const ssd=piezaCompatible('Almacenamiento',cpu,placa);agregar(ssd);
 const fuente=piezaCompatible('Fuente',cpu,placa);agregar(fuente);
 const gabinete=piezaCompatible('Gabinete',cpu,placa);agregar(gabinete);
 const refrigeracion=piezaCompatible('Refrigeración',cpu,placa);agregar(refrigeracion);
 const grafica=piezaCompatible('Tarjeta gráfica',cpu,placa);agregar(grafica);
 elegidos.forEach(p=>{const select=selects.find(s=>s.dataset.grupo===p.tipo);if(select)select.value=String(p.id)});
 actualizar();
 const categorias=new Set(elegidos.map(p=>p.tipo));
 const faltan=grupos.filter(g=>!categorias.has(g));
 if(faltan.length){aviso.textContent=`Sugerencia basada en el catálogo: ${elegidos.length} piezas por ${cop(total)}. Con ${cop(presupuesto)} no alcanza para completar todas las categorías; faltan: ${faltan.join(', ')}. Puedes ajustar la selección.`}
 else aviso.textContent=`¡Listo! Seleccionamos ${elegidos.length} componentes por ${cop(total)}. Revisa la compatibilidad final antes de comprar.`;
}
async function guardar(e){e.preventDefault();const form=e.currentTarget,datos=new FormData(form),seleccion=seleccionActual(),aviso=document.querySelector('#respuesta-config'),boton=form.querySelector('button[type="submit"]');if(!seleccion.length){aviso.textContent='Selecciona piezas o usa “Elegir piezas automáticamente”.';return}boton.disabled=true;aviso.textContent='Enviando tu configuración al panel de administración…';try{const r=await fetch('/api/configuraciones',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre:datos.get('nombre'),email:datos.get('email'),presupuesto:datos.get('presupuesto')||0,productos:seleccion})});const d=await r.json();if(!r.ok)throw Error(d.error||'No se pudo guardar la configuración.');aviso.textContent=`¡Enviado! Solicitud #${d.id} guardada en el panel de administración. Total: ${cop(d.total)}.`;form.reset();document.querySelectorAll('[name="pieza"]').forEach(s=>s.value='');actualizar()}catch(err){aviso.textContent=err.message}finally{boton.disabled=false}}
document.addEventListener('DOMContentLoaded',cargar);
