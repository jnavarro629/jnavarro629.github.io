// area-personal-security.js
// Script para proteger el acceso al área personal

// Función para verificar si hay una sesión activa
function verificarSesionAreaPersonal() {
  const sesionGuardada = sessionStorage.getItem("usuarioLogueado");

  if (!sesionGuardada) {
    // No hay sesión, redirigir al index
    mostrarMensajeError("Debes iniciar sesión para acceder al área personal");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    return false;
  }

  try {
    const datosUsuario = JSON.parse(sesionGuardada);
    // Verificar que la sesión no tenga más de 24 horas
    const tiempoMaximo = 24 * 60 * 60 * 1000; // 24 horas en millisegundos

    if (Date.now() - datosUsuario.timestamp > tiempoMaximo) {
      // Sesión expirada
      sessionStorage.removeItem("usuarioLogueado");
      mostrarMensajeError(
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente"
      );
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
      return false;
    }

    // Sesión válida, mostrar información del usuario
    mostrarInfoUsuario(datosUsuario);
    return true;
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    sessionStorage.removeItem("usuarioLogueado");
    mostrarMensajeError(
      "Error en la sesión. Por favor, inicia sesión nuevamente"
    );
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    return false;
  }
}

// Función para mostrar información del usuario en el área personal
function mostrarInfoUsuario(usuario) {
  // Actualizar el título de la página o algún elemento con el nombre del usuario
  const tituloSection = document.querySelector(".titulo-section");
  if (tituloSection) {
    tituloSection.textContent = `ÁREA PERSONAL - ${usuario.nombre}`;
  }

  // Actualizar el botón de login en el header si existe
  const botonLogin = document.querySelector(".boton-login");
  if (botonLogin) {
    botonLogin.innerHTML = `
      <i class="fas fa-user"></i>
      <span>${usuario.nombre}</span>
      <i class="fas fa-chevron-down"></i>
    `;
    botonLogin.classList.add("usuario-logueado");
  }

  console.log(`Usuario autenticado: ${usuario.nombre} (${usuario.rol})`);
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
  // Crear overlay de bloqueo
  const overlay = document.createElement("div");
  overlay.className = "overlay-error";
  overlay.innerHTML = `
    <div class="mensaje-error-container">
      <div class="mensaje-error">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Acceso Denegado</h3>
        <p>${mensaje}</p>
        <div class="spinner"></div>
        <p class="redirecciones">Redirigiendo a la página principal...</p>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

// Función para cerrar sesión desde el área personal
function cerrarSesionAreaPersonal() {
  sessionStorage.removeItem("usuarioLogueado");
  mostrarMensajeExito("Sesión cerrada correctamente");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// Función para mostrar mensajes de éxito
function mostrarMensajeExito(mensaje) {
  const notificacion = document.createElement("div");
  notificacion.className = "notificacion-exito";
  notificacion.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${mensaje}</span>
  `;

  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.classList.add("mostrar");
  }, 100);

  setTimeout(() => {
    notificacion.classList.remove("mostrar");
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Verificar acceso inmediatamente al cargar el script
document.addEventListener("DOMContentLoaded", function () {
  console.log("Verificando acceso al área personal...");
  verificarSesionAreaPersonal();
});

// Verificar sesión cada 5 minutos mientras el usuario está en la página
setInterval(verificarSesionAreaPersonal, 5 * 60 * 1000);

// Estilos para los mensajes de error
const estilosSeguridad = `
<style>
.overlay-error {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.mensaje-error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.mensaje-error {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.mensaje-error i {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.mensaje-error h3 {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.mensaje-error p {
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.redirecciones {
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e74c3c;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.notificacion-exito {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10000;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.notificacion-exito.mostrar {
  transform: translateX(0);
  opacity: 1;
}

.usuario-logueado {
  background: linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border-color: rgba(16, 185, 129, 0.5) !important;
}
</style>
`;

// Añadir estilos al head
document.head.insertAdjacentHTML("beforeend", estilosSeguridad);
