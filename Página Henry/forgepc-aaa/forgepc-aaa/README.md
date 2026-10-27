# ForgePC — AAA base

## Ejecutar
1. Descomprime el ZIP y abre la carpeta en VS Code.
2. Usa Live Server (o cualquier servidor local estático).
3. Abre `index.html` servido por localhost. No uses `file://`.
4. Se necesita internet para Three.js desde jsDelivr y las fuentes web.

## Arquitectura
- `index.html`: estructura semántica.
- `css/styles.css`: estilo responsive oscuro, morado/cian.
- `js/catalog.js`: catálogo de ejemplo en COP y especificaciones.
- `js/compatibility.js`: reglas de compatibilidad y búsqueda automática.
- `js/scene3d.js`: escena Three.js, cámara, materiales y hardware procedural.
- `js/ui.js`: panel, selectores, presupuesto y exportación TXT.
- `js/main.js`: estado y coordinación.

## Modelo 3D
El modelo actual es procedural, no una reproducción exacta de componentes comerciales. `scene3d.js` incluye `loadExternalModel(url)` como punto de partida para GLB. Para usar un gabinete real, prepara un `.glb` optimizado en Blender y modifica `buildCase()`/`rebuild()` para conservar puntos de montaje de GPU, placa, fuente y ventiladores.

Three.js recomienda glTF/GLB para assets en tiempo real: https://threejs.org/manual/#en/loading-3d-models
Loader: https://threejs.org/docs/pages/GLTFLoader.html
Poly Haven publica assets CC0: https://polyhaven.com/es/license

## Importante
Precios y especificaciones son ficticios. Las reglas de compatibilidad son aproximadas y la puntuación automática es heurística; verifica datos del fabricante, disponibilidad y precios antes de publicar o comprar.
