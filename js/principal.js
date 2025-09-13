// Menu vertical
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  // Verificar si el menú vertical ya existe
  let verticalMenu = document.querySelector(".menu.vertical");

  // Si no existe, crear el menú vertical
  if (!verticalMenu) {
    verticalMenu = menu.cloneNode(true);
    verticalMenu.classList.add("vertical");

    // Asegurarse de que se inserta después de la cabecera-2
    const cabecera2 = document.querySelector(".cabecera-2");
    cabecera2.appendChild(verticalMenu);
  }

  // Evento para mostrar/ocultar el menú
  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation(); // Evitar que el clic se propague
    verticalMenu.classList.toggle("active");
  });

  // Cerrar al hacer clic en enlaces
  document.querySelectorAll(".vertical a").forEach((link) => {
    link.addEventListener("click", () => {
      verticalMenu.classList.remove("active");
    });
  });

  // Cierra el menú al hacer clic fuera
  document.addEventListener("click", function (event) {
    if (
      !verticalMenu.contains(event.target) &&
      !menuToggle.contains(event.target) &&
      verticalMenu.classList.contains("active")
    ) {
      verticalMenu.classList.remove("active");
    }
  });
});

// Para el carrusel:
document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar elementos del carrusel
  const tarjetas = document.querySelectorAll(".tarjeta-escuela");
  const btnAnterior = document.querySelector(".anterior");
  const btnSiguiente = document.querySelector(".siguiente");
  const indicadores = document.querySelectorAll(".indicador");
  let tarjetaActual = 0;

  // Mostrar la tarjeta inicial
  mostrarTarjeta(tarjetaActual);

  // Event listeners para los controles
  btnSiguiente.addEventListener("click", () => {
    cambiarTarjeta(1);
  });

  btnAnterior.addEventListener("click", () => {
    cambiarTarjeta(-1);
  });

  // Event listeners para los indicadores
  indicadores.forEach((indicador, index) => {
    indicador.addEventListener("click", () => {
      tarjetaActual = index;
      mostrarTarjeta(tarjetaActual);
    });
  });

  // Función para cambiar de tarjeta
  function cambiarTarjeta(direccion) {
    tarjetaActual += direccion;

    // Circular entre las tarjetas
    if (tarjetaActual < 0) {
      tarjetaActual = tarjetas.length - 1;
    } else if (tarjetaActual >= tarjetas.length) {
      tarjetaActual = 0;
    }

    mostrarTarjeta(tarjetaActual);
  }

  // Función para mostrar una tarjeta específica
  function mostrarTarjeta(index) {
    // Quitar clase activa de todas las tarjetas
    tarjetas.forEach((tarjeta) => {
      tarjeta.classList.remove("activa", "salida");
    });

    // Añadir clase activa a la tarjeta actual
    tarjetas[index].classList.add("activa");

    // Actualizar indicadores
    indicadores.forEach((indicador) => {
      indicador.classList.remove("activo");
    });
    indicadores[index].classList.add("activo");
  }

  // Opcional: Carrusel automático
  // setInterval(() => cambiarTarjeta(1), 5000);
});

// Carrusel de imágenes del campus
document.addEventListener("DOMContentLoaded", function () {
  const imagenes = document.querySelectorAll(".imagen-carrusel");
  const btnAnterior = document.querySelector(".anterior-campus");
  const btnSiguiente = document.querySelector(".siguiente-campus");
  let imagenActual = 0;

  // Mostrar la primera imagen
  mostrarImagen(imagenActual);

  // Event listeners para los controles
  btnSiguiente.addEventListener("click", () => {
    imagenActual = (imagenActual + 1) % imagenes.length;
    mostrarImagen(imagenActual);
  });

  btnAnterior.addEventListener("click", () => {
    imagenActual = (imagenActual - 1 + imagenes.length) % imagenes.length;
    mostrarImagen(imagenActual);
  });

  // Función para mostrar una imagen específica
  function mostrarImagen(index) {
    imagenes.forEach((imagen) => {
      imagen.classList.remove("activa");
    });
    imagenes[index].classList.add("activa");
  }

  // Opcional: Carrusel automático
  // setInterval(() => {
  //   imagenActual = (imagenActual + 1) % imagenes.length;
  //   mostrarImagen(imagenActual);
  // }, 5000);
});

// Scroll suave para los enlaces del menú
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Ajuste para el header
          behavior: "smooth",
        });
      }
    });
  });
});

// Modal inscripción
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-inscripcion");
  const boton = document.querySelector("#club .boton"); // primer botón "Únete al Club"
  const cerrar = document.querySelector(".cerrar");

  boton.addEventListener("click", (e) => {
    e.preventDefault(); // evitar salto a #contacto
    modal.style.display = "block";
  });

  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});
