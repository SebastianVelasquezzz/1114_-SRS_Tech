# ForgePC — Configurador 3D

Demo en HTML, CSS y JavaScript con Three.js. La torre se construye mediante geometrías 3D y se actualiza según el presupuesto introducido en COP.

## Ejecutar
1. Descomprime el ZIP.
2. Abre la carpeta en Visual Studio Code.
3. Instala la extensión **Live Server**.
4. Clic derecho en `index.html` → **Open with Live Server**.
5. Usa el campo de presupuesto o el deslizador. Arrastra el modelo para girarlo y usa la rueda del ratón para acercar/alejar.

No abras el archivo directamente con `file://`: se recomienda un servidor local para módulos JavaScript.

## Personalizar
En `index.html`, dentro del módulo JavaScript, busca `const builds = [...]`.
Cada objeto representa un nivel de configuración con precios de demostración. Sustituye nombres y valores por precios reales de tiendas colombianas. El sistema selecciona la configuración completa de mayor nivel que cabe dentro del presupuesto.

## Importante
- Los precios del ejemplo son ficticios y no representan cotizaciones actuales.
- Es una maqueta visual: para representar productos exactos, sustituye las geometrías de `rebuildHardware()` por archivos `.glb/.gltf` de componentes reales.
- Requiere internet para descargar Three.js desde jsDelivr.
