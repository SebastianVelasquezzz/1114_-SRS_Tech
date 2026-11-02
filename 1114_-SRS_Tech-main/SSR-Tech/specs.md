# Especificación del proyecto: PC Builder

## 1. Información general

**Nombre del proyecto:** PC Builder  
**Tipo de sistema:** Plataforma web de comercio electrónico  
**Propósito:** Permitir la configuración y venta de computadores personalizados.

## 2. Descripción del sistema

PC Builder permitirá que los usuarios construyan un computador personalizado a partir de su presupuesto, uso principal, preferencias y nivel de rendimiento esperado. El sistema generará una configuración inicial de componentes compatibles y permitirá modificarla antes de convertirla en un pedido.

El proceso estará centrado en las necesidades del usuario y no únicamente en la exploración de un catálogo.

## 3. Objetivo general

Crear una plataforma web que permita construir un computador personalizado sin requerir conocimientos avanzados de hardware.

## 4. Objetivos funcionales

El sistema deberá:

- Adaptarse al presupuesto del usuario.
- Identificar el uso principal y los usos secundarios del computador.
- Recomendar componentes adecuados.
- Comprobar la compatibilidad entre los componentes.
- Permitir cambios manuales en la configuración.
- Mostrar la distribución del presupuesto.
- Permitir guardar configuraciones.
- Convertir una configuración terminada en un pedido.
- Conservar la configuración exacta comprada y su precio correspondiente.

## 5. Alcance funcional

### 5.1 Configurador

El configurador deberá solicitar:

- Presupuesto disponible.
- Uso principal.
- Usos secundarios.
- Nivel de rendimiento esperado.
- Preferencias de almacenamiento.
- Posibilidad de futuras actualizaciones.

Con estos datos se generará una configuración inicial.

### 5.2 Recomendación de componentes

La recomendación deberá considerar:

- Precio.
- Rendimiento.
- Compatibilidad.
- Disponibilidad.
- Consumo energético.
- Relación precio/rendimiento.
- Necesidades del usuario.

La configuración deberá buscar un equipo equilibrado y no solamente seleccionar los componentes más potentes.

### 5.3 Comprobación de compatibilidad

Antes de confirmar una configuración, el sistema deberá validar:

- **Procesador y placa madre:** socket y características necesarias.
- **Memoria RAM y placa madre:** tipo de memoria y capacidades soportadas.
- **Tarjeta gráfica y gabinete:** dimensiones compatibles.
- **Fuente de alimentación:** potencia suficiente.
- **Placa madre y gabinete:** factor de forma.

### 5.4 Personalización

El usuario podrá cambiar individualmente los componentes recomendados.

Cada cambio deberá actualizar automáticamente:

- Precio total.
- Presupuesto restante.
- Estado de compatibilidad.
- Consumo estimado.
- Advertencias relevantes.

### 5.5 Control del presupuesto

El presupuesto deberá permanecer visible durante todo el proceso.

El sistema mostrará:

- Presupuesto inicial.
- Valor de la configuración.
- Dinero disponible.
- Exceso sobre el presupuesto, cuando corresponda.

Si se supera el presupuesto, podrá ofrecer alternativas para reducir el precio.

### 5.6 Explicación de recomendaciones

Cada componente recomendado deberá incluir una explicación breve que indique por qué fue seleccionado y cómo se relaciona con el uso y presupuesto del usuario.

### 5.7 Configuraciones guardadas

Los usuarios registrados podrán guardar configuraciones para continuar trabajando posteriormente.

Una configuración guardada deberá incluir:

- Nombre.
- Presupuesto.
- Uso.
- Componentes.
- Precio total.
- Fecha de creación.

### 5.8 Sistema de pedidos

Una configuración terminada podrá convertirse en un pedido. El pedido deberá conservar:

- Usuario.
- Configuración seleccionada.
- Componentes exactos.
- Precio total.
- Estado del pedido.
- Fecha de creación.

## 6. Arquitectura del sistema

La arquitectura propuesta estará compuesta por:

```text
Frontend
   ↓
API REST
   ↓
Backend
   ↓
Base de datos
```

### 6.1 Frontend

Tecnologías propuestas:

- HTML5.
- CSS3.
- JavaScript.

Responsabilidades:

- Interfaz de usuario.
- Configurador.
- Formularios.
- Visualización de productos.
- Actualización de precios.
- Comunicación con la API.
- Diseño responsive.

### 6.2 Backend

Tecnologías propuestas:

- Node.js.
- Express.js.

Responsabilidades:

- Autenticación.
- Gestión de usuarios.
- Gestión de productos.
- Gestión de configuraciones.
- Validación de compatibilidad.
- Sistema de recomendaciones.
- Gestión de pedidos.
- Validación de información recibida.

### 6.3 Base de datos

Tecnología propuesta:

- PostgreSQL.

La base de datos almacenará productos, características técnicas, usuarios, configuraciones y pedidos.

## 7. Estructura propuesta del proyecto

```text
pc-builder/
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
├── js/
│   ├── app.js
│   ├── configurador.js
│   ├── productos.js
│   ├── autenticacion.js
│   └── api.js
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middleware/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── assets/
│   ├── images/
│   └── icons/
├── .env
├── package.json
└── README.md
```

## 8. Modelo general de datos

### 8.1 Users

| Campo | Descripción |
|---|---|
| id | Identificador del usuario |
| name | Nombre del usuario |
| email | Correo electrónico |
| password_hash | Contraseña almacenada de forma segura |
| created_at | Fecha de creación |

### 8.2 Products

| Campo | Descripción |
|---|---|
| id | Identificador del producto |
| name | Nombre |
| brand | Marca |
| model | Modelo |
| category | Categoría |
| price | Precio |
| stock | Existencias |
| image | Imagen |
| description | Descripción |
| created_at | Fecha de creación |

### 8.3 Components

| Campo | Descripción |
|---|---|
| id | Identificador |
| product_id | Producto relacionado |
| socket | Socket del procesador o placa |
| ram_type | Tipo de memoria |
| tdp | TDP |
| power_consumption | Consumo energético |
| form_factor | Factor de forma |
| length | Longitud |

### 8.4 Configurations

| Campo | Descripción |
|---|---|
| id | Identificador |
| user_id | Usuario propietario |
| name | Nombre de la configuración |
| budget | Presupuesto |
| purpose | Uso |
| priority | Prioridad |
| total_price | Precio total |
| created_at | Fecha de creación |

### 8.5 Configuration_Items

| Campo | Descripción |
|---|---|
| id | Identificador |
| configuration_id | Configuración relacionada |
| product_id | Producto incluido |
| quantity | Cantidad |

### 8.6 Orders

| Campo | Descripción |
|---|---|
| id | Identificador |
| user_id | Usuario que realiza el pedido |
| configuration_id | Configuración comprada |
| total | Total del pedido |
| status | Estado del pedido |
| created_at | Fecha de creación |

## 9. API REST

La comunicación entre frontend y backend se realizará mediante una API REST.

### 9.1 Productos

```http
GET /api/products
GET /api/products/:id
GET /api/products/category/:category
```

### 9.2 Configuraciones

```http
POST /api/configurations
GET /api/configurations/:id
PUT /api/configurations/:id
DELETE /api/configurations/:id
```

### 9.3 Autenticación

```http
POST /api/auth/register
POST /api/auth/login
```

### 9.4 Pedidos

```http
POST /api/orders
GET /api/orders
GET /api/orders/:id
```

## 10. Sistema de recomendación

La primera versión utilizará un sistema basado en reglas.

Reglas iniciales:

- Si el uso es gaming, aumentar la prioridad de la GPU.
- Si el uso es edición de video, aumentar la prioridad de CPU y RAM.
- Si el presupuesto es limitado, priorizar la relación precio/rendimiento.
- Si el usuario busca futuras actualizaciones, priorizar una plataforma con mayor capacidad de expansión.

Posteriormente, el sistema podrá evolucionar hacia un algoritmo de puntuación más complejo.

## 11. Seguridad

El sistema deberá incluir:

- Hash de contraseñas.
- Autenticación.
- Autorización.
- Validación de datos.
- Protección de endpoints.
- Uso de variables de entorno.
- Validación de la información en el servidor.

La información enviada desde el navegador nunca deberá considerarse confiable sin validación en el backend.

## 12. Diseño responsive

La aplicación deberá adaptarse a:

- Computadores.
- Portátiles.
- Tablets.
- Teléfonos.

El configurador deberá conservar su funcionalidad en pantallas pequeñas.

## 13. Desarrollo por etapas

### Fase 1: Interfaz

- Página principal.
- Catálogo.
- Configurador.
- Página de resultados.

### Fase 2: Backend

- API.
- Productos.
- Usuarios.
- Configuraciones.

### Fase 3: Base de datos

- Productos.
- Especificaciones.
- Usuarios.
- Configuraciones.
- Pedidos.

### Fase 4: Compatibilidad

Implementar las validaciones entre componentes.

### Fase 5: Recomendaciones

Implementar el sistema de recomendación basado en reglas.

### Fase 6: Autenticación y configuraciones guardadas

Implementar registro, inicio de sesión y almacenamiento de configuraciones.

### Fase 7: Pedidos y checkout

Implementar la creación de pedidos y el proceso de compra.

## 14. Estado actual

El proyecto se encuentra en fase de planificación.

El siguiente objetivo es construir el MVP del configurador y establecer la estructura de la base de datos antes de desarrollar funcionalidades secundarias.

## 15. Requisitos no definidos en el README

El README no especifica todavía:

- Diseño visual definitivo.
- Proveedor de hosting.
- Método de pago.
- Roles administrativos.
- Proveedor de inventario.
- Formato detallado de respuestas de la API.
- Reglas completas de compatibilidad.
- Algoritmo definitivo de puntuación.
- Políticas de envío, devolución o garantía.
- Pruebas automatizadas.
- Estrategia de despliegue.
