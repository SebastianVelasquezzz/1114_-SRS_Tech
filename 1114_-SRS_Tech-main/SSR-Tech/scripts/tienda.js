// Este archivo controla la tienda y el carrito de compras.

// Identificador del carrito: permite reconocer el carrito del navegador.
let idCarrito = localStorage.getItem("ssr_cart_id");

if (!idCarrito) {
    idCarrito = `carrito_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("ssr_cart_id", idCarrito);
}

// Símbolos sencillos para reconocer cada tipo de componente.
const simbolos = {
    "Procesador": "◈",
    "Tarjeta gráfica": "▧",
    "Memoria RAM": "▤",
    "Placa madre": "▦",
    "Almacenamiento": "▰",
    "Fuente": "ϟ",
    "Gabinete": "▣",
    "Refrigeración": "❄"
};

// Convierte un número a pesos colombianos.
function mostrarPrecio(precio) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(Number(precio) || 0);
}

// Evita que los textos recibidos del servidor se interpreten como HTML.
function limpiarTexto(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, function (letra) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[letra];
    });
}

// Envía una petición al servidor y devuelve la respuesta.
async function consultarServidor(url, datos = null) {
    const opciones = {};

    if (datos) {
        opciones.method = "POST";
        opciones.headers = {
            "Content-Type": "application/json"
        };
        opciones.body = JSON.stringify({
            ...datos,
            cart_id: idCarrito
        });
    }

    const respuesta = await fetch(url, opciones);
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(resultado.error || "No se pudo completar la acción.");
    }

    return resultado;
}

// Muestra los productos que vienen de la base de datos.
async function cargarProductos() {
    const contenedor = document.querySelector("#productos-tienda");

    if (!contenedor) {
        return;
    }

    try {
        const productos = await consultarServidor("/api/productos");

        if (productos.length === 0) {
            contenedor.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
            return;
        }

        contenedor.innerHTML = productos.map(function (producto) {
            let imagen = "";

            if (producto.imagen) {
                imagen = `
                    <img
                        src="${limpiarTexto(producto.imagen)}"
                        alt="${limpiarTexto(producto.nombre)}"
                        loading="lazy"
                    >
                `;
            } else {
                imagen = `<span>${limpiarTexto(simbolos[producto.tipo] || "◇")}</span>`;
            }

            return `
                <article class="pieza-tienda">
                    <div class="pieza-imagen">
                        ${imagen}
                    </div>

                    <div class="pieza-info">
                        <small class="categoria">${limpiarTexto(producto.tipo)}</small>
                        <h3>${limpiarTexto(producto.nombre)}</h3>
                        <p>${limpiarTexto(producto.detalle)}</p>

                        <div>
                            <strong>${mostrarPrecio(producto.precio)}</strong>
                            <button
                                type="button"
                                class="anadir-carrito"
                                data-id="${Number(producto.id)}"
                            >
                                Añadir +
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    } catch (error) {
        contenedor.innerHTML = `
            <p role="alert">
                ${limpiarTexto(error.message)}.
                Comprueba que el servidor esté encendido.
            </p>
        `;
    }
}

// Actualiza los productos, las cantidades y el total del carrito.
async function mostrarCarrito() {
    const contenedor = document.querySelector("#lineas-carrito");

    if (!contenedor) {
        return;
    }

    try {
        const carrito = await consultarServidor(
            `/api/carrito?cart_id=${encodeURIComponent(idCarrito)}`
        );

        const cantidad = document.querySelector("#cantidad-carrito");
        const textoCantidad = document.querySelector("#items-carrito");
        const total = document.querySelector("#total-carrito");

        if (cantidad) {
            cantidad.textContent = carrito.cantidad;
        }

        if (textoCantidad) {
            textoCantidad.textContent =
                `${carrito.cantidad} ${carrito.cantidad === 1 ? "pieza" : "piezas"}`;
        }

        if (total) {
            total.textContent = mostrarPrecio(carrito.total);
        }

        if (carrito.articulos.length === 0) {
            contenedor.innerHTML = `
                <div class="carrito-vacio">
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega las piezas que necesitas y aparecerán aquí.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = carrito.articulos.map(function (producto) {
            return `
                <article class="linea-carrito">
                    <span class="simbolo-carrito">
                        ${limpiarTexto(simbolos[producto.tipo] || "◇")}
                    </span>

                    <div>
                        <small>${limpiarTexto(producto.tipo)}</small>
                        <b>${limpiarTexto(producto.nombre)}</b>
                        <strong>${mostrarPrecio(producto.precio)} c/u</strong>
                        <small>Subtotal: ${mostrarPrecio(producto.subtotal)}</small>

                        <div class="cantidad-control">
                            <button
                                type="button"
                                aria-label="Disminuir ${limpiarTexto(producto.nombre)}"
                                data-cambio="-1"
                                data-id="${Number(producto.id)}"
                            >−</button>

                            <span>${Number(producto.cantidad)}</span>

                            <button
                                type="button"
                                aria-label="Aumentar ${limpiarTexto(producto.nombre)}"
                                data-cambio="1"
                                data-id="${Number(producto.id)}"
                            >+</button>

                            <button
                                type="button"
                                class="quitar-pieza"
                                data-quitar="1"
                                data-id="${Number(producto.id)}"
                            >Quitar</button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    } catch (error) {
        contenedor.innerHTML = `<p role="alert">${limpiarTexto(error.message)}</p>`;
    }
}

// Abre o cierra el panel del carrito.
function abrirCarrito(abrir) {
    const panel = document.querySelector("#panel-carrito");
    const sombra = document.querySelector("#sombra-carrito");

    if (!panel || !sombra) {
        return;
    }

    panel.classList.toggle("visible", abrir);
    sombra.classList.toggle("visible", abrir);
    panel.setAttribute("aria-hidden", String(!abrir));
    document.body.style.overflow = abrir ? "hidden" : "";
}

// Muestra mensajes debajo del formulario de compra.
function mostrarMensajeCompra(texto) {
    const mensaje = document.querySelector("#mensaje-compra");

    if (mensaje) {
        mensaje.textContent = texto;
    }
}

// Activa los botones cuando termina de cargar la página.
document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();
    mostrarCarrito();

    // Añadir un producto al carrito.
    const listaProductos = document.querySelector("#productos-tienda");

    if (listaProductos) {
        listaProductos.addEventListener("click", async function (evento) {
            const boton = evento.target.closest(".anadir-carrito");

            if (!boton) {
                return;
            }

            boton.disabled = true;

            try {
                await consultarServidor("/api/carrito/agregar", {
                    producto_id: Number(boton.dataset.id),
                    cantidad: 1
                });

                await mostrarCarrito();

                const textoAnterior = boton.textContent;
                boton.textContent = "Agregado";

                setTimeout(function () {
                    boton.textContent = textoAnterior;
                    boton.disabled = false;
                }, 850);
            } catch (error) {
                alert(error.message);
                boton.disabled = false;
            }
        });
    }

    // Cambiar la cantidad o quitar un producto.
    const listaCarrito = document.querySelector("#lineas-carrito");

    if (listaCarrito) {
        listaCarrito.addEventListener("click", async function (evento) {
            const boton = evento.target.closest("[data-id]");

            if (!boton) {
                return;
            }

            const idProducto = Number(boton.dataset.id);

            try {
                if (boton.dataset.quitar) {
                    await consultarServidor("/api/carrito/quitar", {
                        producto_id: idProducto
                    });
                } else {
                    const carrito = await consultarServidor(
                        `/api/carrito?cart_id=${encodeURIComponent(idCarrito)}`
                    );

                    const producto = carrito.articulos.find(function (pieza) {
                        return pieza.id === idProducto;
                    });

                    if (!producto) {
                        return;
                    }

                    const nuevaCantidad =
                        producto.cantidad + Number(boton.dataset.cambio);

                    if (nuevaCantidad <= 0) {
                        await consultarServidor("/api/carrito/quitar", {
                            producto_id: idProducto
                        });
                    } else {
                        await consultarServidor("/api/carrito/cantidad", {
                            producto_id: idProducto,
                            cantidad: nuevaCantidad
                        });
                    }
                }

                await mostrarCarrito();
            } catch (error) {
                mostrarMensajeCompra(error.message);
            }
        });
    }

    // Botones para abrir y cerrar el carrito.
    document.querySelector("#abrir-carrito")?.addEventListener("click", function () {
        abrirCarrito(true);
    });

    document.querySelector("#cerrar-carrito")?.addEventListener("click", function () {
        abrirCarrito(false);
    });

    document.querySelector("#sombra-carrito")?.addEventListener("click", function () {
        abrirCarrito(false);
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            abrirCarrito(false);
        }
    });

    // Envía los datos del comprador para registrar el pedido.
    const formularioCompra = document.querySelector("#compra-form");

    if (formularioCompra) {
        formularioCompra.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const boton = formularioCompra.querySelector('button[type="submit"]');
            boton.disabled = true;
            mostrarMensajeCompra("Registrando tu pedido…");

            try {
                const datos = Object.fromEntries(new FormData(formularioCompra));
                const pedido = await consultarServidor("/api/carrito/comprar", datos);

                mostrarMensajeCompra(
                    `Pedido #${pedido.orden} registrado correctamente. Total: ${mostrarPrecio(pedido.total)}.`
                );

                formularioCompra.reset();
                await mostrarCarrito();
            } catch (error) {
                mostrarMensajeCompra(error.message);
            } finally {
                boton.disabled = false;
            }
        });
    }
});
