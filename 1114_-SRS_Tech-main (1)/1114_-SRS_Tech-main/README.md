# PC Builder

Plataforma web para la configuración y venta de computadores personalizados.

## Descripción

PC Builder es una plataforma de comercio electrónico enfocada en la construcción de computadores personalizados. El sistema permite que un usuario defina cuánto dinero desea invertir y para qué necesita el computador. A partir de esta información, la plataforma genera una configuración de componentes compatible y ajustada al presupuesto disponible.

El proyecto busca solucionar uno de los principales problemas de las tiendas tradicionales de hardware: el usuario normalmente debe conocer los componentes, sus características y su compatibilidad antes de realizar una compra.

En PC Builder, el proceso comienza con las necesidades del usuario y no con un catálogo de productos.

Por ejemplo:

> Presupuesto: $3.000.000 COP  
> Uso: Gaming y estudio  
> Prioridad: Rendimiento

El sistema utiliza estos datos para proponer una configuración y posteriormente permite modificar cada componente.

---

## Objetivo

Crear una plataforma que permita a una persona construir un computador personalizado sin necesidad de tener conocimientos avanzados sobre hardware.

El sistema debe:

- Adaptarse al presupuesto del usuario.
- Identificar el uso principal del computador.
- Recomendar componentes adecuados.
- Comprobar la compatibilidad entre componentes.
- Permitir modificaciones manuales.
- Mostrar cómo se distribuye el presupuesto.
- Permitir guardar configuraciones.
- Convertir una configuración terminada en un pedido.

---

## Diferencia frente a una tienda tradicional

Una tienda convencional normalmente funciona de la siguiente manera:

```text
Catálogo
   ↓
Buscar componente
   ↓
Agregar al carrito
   ↓
Buscar otro componente
   ↓
Comprobar compatibilidad manualmente
   ↓
Comprar
```

PC Builder plantea otro flujo:

```text
Presupuesto
   ↓
Uso del computador
   ↓
Preferencias
   ↓
Configuración recomendada
   ↓
Personalización
   ↓
Comprobación de compatibilidad
   ↓
Compra
```

El catálogo continúa existiendo, pero deja de ser el punto principal de entrada.

---

# Funcionalidades

## Configurador

El usuario puede comenzar una configuración indicando:

- Presupuesto.
- Uso principal.
- Usos secundarios.
- Nivel de rendimiento esperado.
- Preferencias de almacenamiento.
- Posibilidad de futuras actualizaciones.

El sistema utiliza estos datos para generar una configuración inicial.

---

## Recomendación de componentes

El sistema selecciona componentes teniendo en cuenta:

- Precio.
- Rendimiento.
- Compatibilidad.
- Disponibilidad.
- Consumo energético.
- Relación precio/rendimiento.
- Necesidades del usuario.

La recomendación no debe limitarse a seleccionar el componente más potente. El objetivo es construir un equipo equilibrado dentro del presupuesto.

---

## Compatibilidad

Antes de confirmar una configuración, el sistema debe comprobar las relaciones entre los componentes.

Algunos ejemplos:

### Procesador y placa madre

Se debe comprobar el socket y las características necesarias para utilizar el procesador.

### Memoria RAM y placa madre

Se debe comprobar el tipo de memoria y las capacidades soportadas.

### Tarjeta gráfica y gabinete

Se debe comprobar que las dimensiones de la tarjeta sean compatibles con el gabinete.

### Fuente de alimentación

Se debe comprobar que la potencia disponible sea suficiente para los componentes seleccionados.

### Placa madre y gabinete

Se debe comprobar el factor de forma.

---

## Personalización

Después de recibir una configuración recomendada, el usuario puede cambiar componentes individualmente.

Por ejemplo:

```text
Procesador
Ryzen 5 XXXX
[ Cambiar ]

Tarjeta gráfica
RTX XXXX
[ Cambiar ]

Memoria
32 GB DDR5
[ Cambiar ]

Almacenamiento
1 TB NVMe
[ Cambiar ]
```

Cada cambio debe actualizar automáticamente:

- Precio total.
- Presupuesto restante.
- Compatibilidad.
- Consumo estimado.
- Advertencias relevantes.

---

## Presupuesto

El presupuesto debe permanecer visible durante todo el proceso.

Ejemplo:

```text
Presupuesto       $3.000.000
Configuración     $2.840.000
Disponible          $160.000
```

Si el usuario supera el presupuesto:

```text
Presupuesto       $3.000.000
Configuración     $3.180.000
Exceso              $180.000
```

El sistema puede ofrecer alternativas para reducir el precio.

---

## Explicación de las recomendaciones

Cada componente recomendado debe incluir una explicación breve.

Ejemplo:

```text
¿Por qué este procesador?

Esta opción mantiene un buen equilibrio entre
rendimiento y precio para una configuración
orientada a gaming dentro del presupuesto indicado.
```

El objetivo es que el usuario entienda la razón de cada selección.

---

## Configuraciones guardadas

Los usuarios registrados pueden guardar sus configuraciones para continuar trabajando posteriormente.

Una configuración puede contener:

```text
Nombre
Presupuesto
Uso
Componentes
Precio total
Fecha de creación
```

---

## Sistema de pedidos

Una configuración terminada puede convertirse en un pedido.

El sistema debe conservar la configuración exacta que el usuario compró, incluyendo todos sus componentes y el precio correspondiente.

---

# Arquitectura

El proyecto estará dividido en tres partes principales:

```text
Frontend
    ↓
API
    ↓
Backend
    ↓
Base de datos
```

## Frontend

Tecnologías principales:

- HTML5
- CSS3
- JavaScript

El frontend será responsable de:

- Interfaz.
- Configurador.
- Formularios.
- Visualización de productos.
- Actualización de precios.
- Comunicación con la API.

---

## Backend

Tecnología propuesta:

- Node.js
- Express.js

El backend será responsable de:

- Autenticación.
- Productos.
- Usuarios.
- Configuraciones.
- Compatibilidad.
- Recomendaciones.
- Pedidos.
- Validación de información.

---

## Base de datos

Base de datos propuesta:

- PostgreSQL

La base de datos almacenará productos, características técnicas, usuarios, configuraciones y pedidos.

---

# Estructura del proyecto

```text
pc-builder/
│
├── frontend/
│   ├── index.html
│   ├── configurador.html
│   ├── productos.html
│   ├── producto.html
│   ├── login.html
│   ├── registro.html
│   ├── perfil.html
│   └── css/
│       ├── style.css
│       ├── configurador.css
│       └── responsive.css
│
├── js/
│   ├── app.js
│   ├── configurador.js
│   ├── productos.js
│   ├── autenticacion.js
│   └── api.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middleware/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── assets/
│   ├── images/
│   └── icons/
│
├── .env
├── package.json
└── README.md
```

---

# Modelo general de datos

## Users

```text
id
name
email
password_hash
created_at
```

## Products

```text
id
name
brand
model
category
price
stock
image
description
created_at
```

## Components

Contiene las características técnicas necesarias para realizar comprobaciones.

```text
id
product_id
socket
ram_type
tdp
power_consumption
form_factor
length
```

## Configurations

```text
id
user_id
name
budget
purpose
priority
total_price
created_at
```

## Configuration_Items

Relaciona una configuración con sus componentes.

```text
id
configuration_id
product_id
quantity
```

## Orders

```text
id
user_id
configuration_id
total
status
created_at
```

---

# API

La comunicación entre frontend y backend se realizará mediante una API REST.

Ejemplos:

```http
GET /api/products
GET /api/products/:id
GET /api/products/category/:category

POST /api/configurations
GET /api/configurations/:id
PUT /api/configurations/:id
DELETE /api/configurations/:id

POST /api/auth/register
POST /api/auth/login

POST /api/orders
GET /api/orders
GET /api/orders/:id
```

---

# Sistema de recomendación

La primera versión utilizará un sistema basado en reglas.

Ejemplo:

```text
Si el uso es gaming:
    aumentar prioridad de GPU

Si el uso es edición de video:
    aumentar prioridad de CPU y RAM

Si el presupuesto es limitado:
    priorizar relación precio/rendimiento

Si el usuario busca actualizaciones futuras:
    priorizar plataforma con mayor capacidad de expansión
```

Posteriormente este sistema puede evolucionar hacia un algoritmo de puntuación más complejo.

---

# Seguridad

El sistema debe incluir:

- Hash de contraseñas.
- Autenticación.
- Autorización.
- Validación de datos.
- Protección de endpoints.
- Variables de entorno.
- Validación de información en el servidor.

La información enviada desde el navegador nunca debe considerarse confiable sin validación en el backend.

---

# Responsive Design

La aplicación debe adaptarse a:

- Computadores.
- Portátiles.
- Tablets.
- Teléfonos.

El configurador debe conservar su funcionalidad en pantallas pequeñas.

---

# Desarrollo por etapas

## Fase 1

Crear la interfaz:

- Página principal.
- Catálogo.
- Configurador.
- Página de resultados.

## Fase 2

Crear el backend:

- API.
- Productos.
- Usuarios.
- Configuraciones.

## Fase 3

Implementar base de datos:

- Productos.
- Especificaciones.
- Usuarios.
- Configuraciones.
- Pedidos.

## Fase 4

Implementar compatibilidad.

## Fase 5

Implementar el sistema de recomendación.

## Fase 6

Implementar autenticación y configuraciones guardadas.

## Fase 7

Implementar pedidos y checkout.

---

# Estado del proyecto

Actualmente el proyecto se encuentra en fase de planificación.

El siguiente objetivo es construir el MVP del configurador y establecer la estructura de la base de datos antes de desarrollar funcionalidades secundarias.
