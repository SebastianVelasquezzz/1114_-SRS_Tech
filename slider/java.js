
let slideActual = 0;

let slides = document.querySelectorAll(".slide");

let indicadores = document.querySelectorAll(".indicador");


function mostrarSlide(numero) {

    if (numero >= slides.length) {
        slideActual = 0;
    }

    if (numero < 0) {
        slideActual = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {

        slides[i].classList.remove("activo");

        indicadores[i].classList.remove("activo-indicador");
    }

    slides[slideActual].classList.add("activo");

    indicadores[slideActual].classList.add("activo-indicador");
}


function cambiarSlide(direccion) {

    slideActual = slideActual + direccion;

    mostrarSlide(slideActual);
}


function irSlide(numero) {

    slideActual = numero;

    mostrarSlide(slideActual);
}


/* CAMBIO AUTOMATICO */

setInterval(function() {

    cambiarSlide(1);

}, 5000);

