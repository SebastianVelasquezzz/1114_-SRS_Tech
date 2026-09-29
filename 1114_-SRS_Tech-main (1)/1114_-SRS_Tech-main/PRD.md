# Product Requirements Document

## PC Builder

### Versión 1.0

---

# 1. Información general

**Nombre del producto:** PC Builder

**Tipo:** Plataforma web de comercio electrónico y configuración de computadores.

**Plataforma:** Web.

**Tecnologías iniciales:** HTML, CSS y JavaScript.

**Backend propuesto:** Node.js + Express.

**Base de datos propuesta:** PostgreSQL.

---

# 2. Resumen

PC Builder es una plataforma para vender computadores personalizados mediante un sistema de configuración guiada.

El usuario no necesita comenzar seleccionando componentes. Primero indica su presupuesto y el uso que tendrá el computador. El sistema analiza esta información y propone una configuración compatible.

Posteriormente, el usuario puede modificar los componentes y recibir información sobre el impacto de cada cambio en el precio y en la compatibilidad del equipo.

La plataforma busca simplificar la compra de hardware y reducir los errores que pueden producirse cuando una persona selecciona componentes sin conocer sus relaciones técnicas.

---

# 3. Problema

Comprar un computador por componentes puede ser complicado para usuarios que no conocen las características del hardware.

Una persona puede conocer cuánto dinero tiene disponible y qué quiere hacer con el computador, pero no necesariamente sabe:

- Qué procesador necesita.
- Qué tarjeta gráfica elegir.
- Qué placa madre es compatible.
- Cuánta RAM necesita.
- Qué fuente debe utilizar.
- Qué gabinete puede contener todos los componentes.
- Qué componentes debería priorizar.

Las tiendas tradicionales trasladan gran parte de estas decisiones al usuario.

PC Builder pretende trasladar parte de esa complejidad al sistema.

---

# 4. Propuesta de valor

El producto debe responder a una necesidad concreta:

> "Quiero comprar un computador, sé cuánto puedo gastar y para qué lo necesito, pero no sé exactamente qué componentes debo comprar."

La plataforma convierte esa información en una configuración concreta.

El valor principal no está solamente en vender componentes, sino en ayudar al usuario a tomar una decisión.

---

# 5. Público objetivo

## Usuarios principiantes

Personas con poco conocimiento sobre hardware.

Necesitan:

- Proceso sencillo.
- Recomendaciones.
- Explicaciones.
- Protección contra incompatibilidades.

## Usuarios intermedios

Personas que conocen los componentes principales, pero quieren ahorrar tiempo.

Necesitan:

- Configuración inicial.
- Personalización.
- Comparación.
- Información técnica.

## Usuarios avanzados

Personas que quieren controlar todos los componentes.

Necesitan:

- Selección manual.
- Especificaciones detalladas.
- Control sobre la configuración.
- Información de compatibilidad.

---

# 6. Objetivos del producto

## Objetivo principal

Permitir que un usuario cree una configuración de PC compatible y adecuada a su presupuesto sin necesitar conocimientos avanzados.

## Objetivos secundarios

- Reducir el tiempo necesario para seleccionar componentes.
- Reducir configuraciones incompatibles.
- Facilitar la comparación entre componentes.
- Permitir personalización.
- Crear una experiencia de compra diferente a un e-commerce tradicional.

---

# 7. Flujo principal del usuario

```text
Página principal
       ↓
Iniciar configuración
       ↓
Ingresar presupuesto
       ↓
Seleccionar uso
       ↓
Seleccionar prioridades
       ↓
Generar configuración
       ↓
Revisar componentes
       ↓
Personalizar
       ↓
Comprobar compatibilidad
       ↓
Guardar o comprar
       ↓
Checkout
       ↓
Pedido
```

---

# 8. Requisitos funcionales

## RF-001 — Inicio del configurador

La página principal debe proporcionar una entrada clara al configurador.

El usuario debe poder comenzar sin tener una cuenta.

---

## RF-002 — Presupuesto

El sistema debe permitir introducir el presupuesto disponible.

Ejemplo:

```text
Presupuesto

$ 3.000.000 COP
```

El sistema debe validar:

- Valor mínimo.
- Valor máximo.
- Formato numérico.
- Moneda.

---

## RF-003 — Selección de uso

El usuario debe seleccionar uno o varios usos.

Opciones iniciales:

```text
Gaming
Estudio
Trabajo
Programación
Diseño gráfico
Edición de video
Uso general
```

El sistema debe permitir agregar nuevas categorías posteriormente.

---

## RF-004 — Selección de prioridades

El usuario puede establecer prioridades.

Ejemplos:

```text
Rendimiento
Relación precio/rendimiento
Almacenamiento
Actualización futura
Consumo
```

---

## RF-005 — Generación de configuración

El sistema debe generar una configuración utilizando:

```text
Presupuesto
+
Uso
+
Prioridades
+
Productos disponibles
+
Reglas de compatibilidad
```

La configuración debe contener los componentes principales necesarios para formar un computador.

---

## RF-006 — Validación de compatibilidad

El sistema debe comprobar automáticamente las relaciones técnicas entre componentes.

La validación debe ejecutarse en el backend.

El frontend puede mostrar el resultado, pero no debe ser la única capa de validación.

---

## RF-007 — Modificación

El usuario puede cambiar cualquier componente permitido.

Cuando se cambia un componente, el sistema debe recalcular:

```text
Precio
Presupuesto restante
Compatibilidad
Consumo
Advertencias
```

---

## RF-008 — Alternativas

Cuando exista una incompatibilidad o se supere el presupuesto, el sistema debe poder recomendar alternativas.

Ejemplo:

```text
La configuración supera tu presupuesto en $150.000.

Alternativa recomendada:

Cambiar GPU
Actual: $1.300.000
Alternativa: $1.150.000

Ahorro: $150.000
```

---

## RF-009 — Información técnica

Cada componente debe proporcionar información suficiente para que el usuario pueda entender qué está comprando.

La información debe diferenciar entre:

- Información básica.
- Especificaciones técnicas.

---

## RF-010 — Explicación

El sistema debe explicar las razones principales de una recomendación.

No es necesario mostrar el funcionamiento interno del algoritmo.

Debe mostrar información comprensible para el usuario.

---

## RF-011 — Guardar configuración

Un usuario autenticado debe poder guardar una configuración.

Debe poder:

- Crear.
- Editar.
- Eliminar.
- Consultar.

---

## RF-012 — Carrito

El sistema puede utilizar un carrito, pero este no será el elemento principal del proceso.

Una configuración completa debe poder convertirse directamente en una compra.

---

## RF-013 — Pedido

Cuando el usuario confirme una configuración, debe generarse un pedido.

El pedido debe conservar:

- Usuario.
- Configuración.
- Componentes.
- Precio.
- Estado.
- Fecha.

---

# 9. Sistema de recomendación

La primera versión no requiere inteligencia artificial.

Se implementará un sistema determinista basado en reglas y puntuaciones.

Cada componente tendrá información asociada a diferentes usos.

Por ejemplo:

```text
Producto A

Gaming: 90
Edición: 70
Programación: 60
Ofimática: 40
```

El sistema puede combinar estas puntuaciones con el presupuesto y la compatibilidad.

Una posible función conceptual sería:

```text
Puntuación =
rendimiento
+
relación_precio_rendimiento
+
adecuación_al_uso
+
compatibilidad
+
disponibilidad
```

Los pesos de cada criterio pueden variar dependiendo del perfil del usuario.

---

# 10. Sistema de compatibilidad

La compatibilidad será una parte fundamental del producto.

## Procesador

Datos relevantes:

```text
Socket
Consumo
Generación
```

## Placa madre

Datos relevantes:

```text
Socket
Tipo de RAM
Factor de forma
Cantidad de ranuras
```

## RAM

Datos relevantes:

```text
Tipo
Capacidad
Frecuencia
```

## GPU

Datos relevantes:

```text
Longitud
Consumo
Conectores
```

## Fuente

Datos relevantes:

```text
Potencia
Certificación
Conectores
```

## Gabinete

Datos relevantes:

```text
Factor de forma
Longitud máxima de GPU
Compatibilidad con placa madre
Compatibilidad con refrigeración
```

---

# 11. Requisitos de base de datos

La base de datos debe separar los productos comerciales de sus características técnicas.

Por ejemplo:

```text
products
    ↓
Producto comercial

components
    ↓
Características técnicas
```

Esto permite que diferentes tipos de componentes tengan propiedades específicas sin almacenar toda la información en una única tabla.

---

# 12. Entidades principales

```text
User
Product
Component
Configuration
ConfigurationItem
Order
```

Relaciones:

```text
User
 │
 ├── Configurations
 │       │
 │       └── ConfigurationItems
 │                   │
 │                   └── Products
 │
 └── Orders
         │
         └── Configuration
```

---

# 13. Requisitos de interfaz

La interfaz debe priorizar claridad sobre cantidad de elementos.

El usuario debe saber en todo momento:

- En qué paso se encuentra.
- Qué debe hacer.
- Cuánto lleva gastado.
- Qué componente está seleccionando.
- Si existe alguna incompatibilidad.

---

# 14. Página principal

La página principal debe explicar rápidamente la propuesta del producto.

Contenido recomendado:

```text
PC Builder

Construye un computador según tu presupuesto
y las tareas que necesitas realizar.

[ Comenzar configuración ]

También puedes explorar componentes.
```

Debajo puede existir información sobre:

- Cómo funciona.
- Ventajas.
- Configuraciones destacadas.
- Productos disponibles.

---

# 15. Pantalla del configurador

La pantalla puede dividirse en dos áreas.

```text
┌──────────────────────────────┬──────────────────────┐
│                              │                      │
│       Configuración          │     Resumen          │
│                              │                      │
│       Procesador             │     Presupuesto      │
│       Placa madre            │     Utilizado        │
│       RAM                    │     Restante         │
│       GPU                    │     Compatibilidad   │
│       SSD                    │                      │
│       Fuente                 │     Total            │
│       Gabinete               │                      │
│                              │                      │
└──────────────────────────────┴──────────────────────┘
```

En dispositivos móviles esta estructura deberá convertirse en una vista vertical.

---

# 16. Estados de configuración

Una configuración puede encontrarse en diferentes estados:

```text
Borrador
Generada
Personalizada
Con advertencias
Lista para comprar
Comprada
```

Esto permite gestionar correctamente el ciclo de vida de una configuración.

---

# 17. Autenticación

El usuario no necesita iniciar sesión para comenzar una configuración.

Sin embargo, deberá autenticarse para:

- Guardar configuraciones.
- Consultar pedidos.
- Administrar su cuenta.

Esto reduce la fricción durante el primer contacto con la plataforma.

---

# 18. Requisitos de seguridad

El backend debe validar todas las operaciones importantes.

Por ejemplo, el servidor no debe confiar en que el precio enviado por JavaScript sea correcto.

Cuando se realiza una compra:

```text
Frontend
   ↓
Envía productos/configuración
   ↓
Backend
   ↓
Consulta base de datos
   ↓
Comprueba precios
   ↓
Comprueba stock
   ↓
Comprueba compatibilidad
   ↓
Calcula total
   ↓
Crea pedido
```

Esto evita que el usuario pueda modificar los precios desde las herramientas del navegador.

---

# 19. MVP

La primera versión funcional debe limitarse a las funciones necesarias para demostrar el concepto.

### Incluido

- Página principal.
- Configurador.
- Presupuesto.
- Selección de uso.
- Sistema de recomendación básico.
- Catálogo.
- Base de datos.
- Compatibilidad.
- Modificación de componentes.
- Cálculo del precio.
- Registro.
- Inicio de sesión.
- Guardado de configuraciones.

### No incluido inicialmente

- Inteligencia artificial.
- Chatbot.
- Sistema avanzado de benchmarks.
- Pagos reales.
- Sistema de reseñas.
- Programa de afiliados.
- Aplicación móvil.
- Sistema de recomendaciones basado en machine learning.

Estas funciones pueden desarrollarse posteriormente.

---

# 20. Criterios de aceptación

El MVP debe cumplir los siguientes casos.

### Caso 1 — Configuración válida

El usuario introduce un presupuesto y un uso.

El sistema genera una configuración cuyos componentes son compatibles y cuyo precio se encuentra dentro del presupuesto.

### Caso 2 — Cambio de componente

El usuario cambia un componente.

El sistema actualiza el precio y vuelve a comprobar la compatibilidad.

### Caso 3 — Incompatibilidad

El usuario selecciona un componente incompatible.

El sistema informa del problema y no permite confirmar la configuración mientras exista una incompatibilidad crítica.

### Caso 4 — Presupuesto excedido

El usuario selecciona componentes cuyo precio supera el presupuesto.

El sistema muestra cuánto se ha excedido y ofrece la posibilidad de optimizar la configuración.

### Caso 5 — Guardado

El usuario inicia sesión y guarda una configuración.

La configuración debe quedar almacenada en la base de datos.

### Caso 6 — Recuperación

El usuario vuelve posteriormente a su cuenta.

Debe poder recuperar una configuración guardada y continuar modificándola.

### Caso 7 — Compra

El usuario confirma una configuración.

El sistema crea un pedido con los componentes y el precio calculado por el servidor.

---

# 21. Métricas del producto

Las principales métricas serán:

```text
Configuraciones iniciadas
Configuraciones completadas
Configuraciones guardadas
Configuraciones compradas
Tiempo promedio de configuración
Porcentaje de usuarios que modifican recomendaciones
Valor promedio de pedido
```

Una métrica especialmente importante será:

```text
Configuraciones iniciadas
        ↓
Configuraciones terminadas
```

Esto permitirá determinar si el configurador realmente simplifica el proceso de compra.

---

# 22. Evolución futura

Una vez que el MVP sea estable, el sistema puede evolucionar hacia una plataforma de recomendación más avanzada.

Posibles funciones:

- Estimación de rendimiento.
- Comparación de configuraciones.
- Perfiles de usuario.
- Historial de precios.
- Alertas de stock.
- Recomendaciones basadas en configuraciones anteriores.
- Sistema de reseñas.
- Benchmark de componentes.
- Recomendaciones para actualización de equipos existentes.
- Asistente conversacional especializado en hardware.

La inteligencia artificial puede incorporarse posteriormente, pero no debe ser necesaria para que el producto principal funcione.

---

# 23. Principio fundamental del producto

PC Builder no debe convertirse en una tienda tradicional con un configurador añadido.

El configurador debe ser el núcleo de la experiencia.

La pregunta principal de la plataforma no es:

> "¿Qué componente quieres comprar?"

sino:

> "¿Qué computador necesitas y cuánto puedes invertir?"

A partir de esa respuesta, el sistema se encarga de convertir las necesidades del usuario en una configuración concreta, compatible y justificable.
