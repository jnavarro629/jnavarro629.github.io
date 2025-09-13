// Variables del modal de login
const modalLogin = document.getElementById("modal-login");
const botonLogin = document.querySelector(".boton-login");
const cerrarLogin = document.querySelector(".cerrar-login");
const formLogin = document.getElementById("form-login");
const errorLogin = document.getElementById("error-login");

// Variable para almacenar el usuario logueado
let usuarioActual = null;

// Función para manejar el click del botón login (inicial)
function manejarClickLogin(e) {
  e.preventDefault();
  modalLogin.style.display = "block";
  document.body.style.overflow = "hidden";

  // Limpiar campos
  document.getElementById("usuario-login").value = "";
  document.getElementById("password-login").value = "";
  ocultarError();

  // Focus en el campo usuario
  setTimeout(() => {
    document.getElementById("usuario-login").focus();
  }, 100);
}

// Función para manejar el click del menú de usuario (cuando está logueado)
function manejarClickMenuUsuario(e) {
  e.preventDefault();
  mostrarMenuUsuario();
}

// Inicializar el evento del botón login
botonLogin.addEventListener("click", manejarClickLogin);

// Cerrar modal de login
cerrarLogin.addEventListener("click", function () {
  cerrarModalLogin();
});

// Cerrar modal al hacer click fuera
modalLogin.addEventListener("click", function (e) {
  if (e.target === modalLogin) {
    cerrarModalLogin();
  }
});

// Cerrar modal con tecla Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modalLogin.style.display === "block") {
    cerrarModalLogin();
  }
});

// Función para cerrar el modal
function cerrarModalLogin() {
  modalLogin.style.display = "none";
  document.body.style.overflow = "";
  ocultarError();
}

// Manejar el envío del formulario
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario-login").value.trim();
  const password = document.getElementById("password-login").value;
  const botonSubmit = document.querySelector(".boton-login-submit");

  // Validación básica
  if (!usuario || !password) {
    mostrarError("Por favor, completa todos los campos");
    return;
  }

  // Mostrar estado de carga
  botonSubmit.classList.add("cargando");
  botonSubmit.textContent = "Iniciando sesión...";

  // Simular delay de autenticación
  setTimeout(() => {
    // Validar credenciales
    const resultado = validarCredenciales(usuario, password);

    if (resultado.valido) {
      // Login exitoso
      usuarioActual = resultado.usuario;
      usuarioActual.username = usuario;

      // Guardar sesión en sessionStorage
      guardarSesion(usuarioActual);

      // Actualizar interfaz
      actualizarInterfazUsuario();

      // Mostrar mensaje de éxito
      mostrarMensajeExito(`¡Bienvenido/a, ${resultado.usuario.nombre}!`);

      // Cerrar modal
      cerrarModalLogin();
    } else {
      // Login fallido
      mostrarError(resultado.mensaje);
    }

    // Quitar estado de carga
    botonSubmit.classList.remove("cargando");
    botonSubmit.textContent = "Iniciar Sesión";
  }, 1000);
});

// Función para guardar sesión
function guardarSesion(usuario) {
  sessionStorage.setItem(
    "usuarioLogueado",
    JSON.stringify({
      ...usuario,
      timestamp: Date.now(),
    })
  );
}

// Función para verificar si hay una sesión activa
function verificarSesion() {
  const sesionGuardada = sessionStorage.getItem("usuarioLogueado");
  if (sesionGuardada) {
    try {
      const datosUsuario = JSON.parse(sesionGuardada);
      // Verificar que la sesión no tenga más de 24 horas
      const tiempoMaximo = 24 * 60 * 60 * 1000; // 24 horas en millisegundos
      if (Date.now() - datosUsuario.timestamp < tiempoMaximo) {
        usuarioActual = datosUsuario;
        actualizarInterfazUsuario();
        return true;
      } else {
        // Sesión expirada
        sessionStorage.removeItem("usuarioLogueado");
        return false;
      }
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      sessionStorage.removeItem("usuarioLogueado");
      return false;
    }
  }
  return false;
}

// Función para limpiar sesión
function limpiarSesion() {
  sessionStorage.removeItem("usuarioLogueado");
  usuarioActual = null;
}

// Función para mostrar errores
function mostrarError(mensaje) {
  errorLogin.textContent = mensaje;
  errorLogin.style.display = "block";

  setTimeout(() => {
    ocultarError();
  }, 5000);
}

// Función para ocultar errores
function ocultarError() {
  errorLogin.style.display = "none";
  errorLogin.textContent = "";
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

// Función para actualizar la interfaz cuando el usuario está logueado
function actualizarInterfazUsuario() {
  const botonLogin = document.querySelector(".boton-login");

  // Cambiar el botón de login por un menú de usuario
  botonLogin.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${usuarioActual.nombre}</span>
        <i class="fas fa-chevron-down"></i>
    `;

  botonLogin.classList.add("usuario-logueado");

  // Remover el evento anterior y añadir el nuevo
  botonLogin.removeEventListener("click", manejarClickLogin);
  botonLogin.addEventListener("click", manejarClickMenuUsuario);
}

// Función para mostrar el menú del usuario logueado
function mostrarMenuUsuario() {
  // Verificar si ya existe un menú y eliminarlo
  const menuExistente = document.querySelector(".menu-usuario-dropdown");
  if (menuExistente) {
    menuExistente.remove();
    return;
  }

  // Crear menú desplegable con SOLO dos opciones
  const menu = document.createElement("div");
  menu.className = "menu-usuario-dropdown";
  menu.innerHTML = `
        <div class="menu-usuario-item" onclick="irAreaPersonal()">
            <i class="fas fa-user"></i>
            <span>Mi Perfil</span>
        </div>
        <div class="menu-usuario-item" onclick="cerrarSesion()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Cerrar Sesión</span>
        </div>
    `;

  // Posicionar el menú
  const botonLogin = document.querySelector(".boton-login");
  const rect = botonLogin.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top = rect.bottom + 5 + "px";
  menu.style.right = "20px";

  document.body.appendChild(menu);

  // Cerrar menú al hacer click fuera
  setTimeout(() => {
    document.addEventListener("click", function cerrarMenu(e) {
      if (!menu.contains(e.target) && !botonLogin.contains(e.target)) {
        menu.remove();
        document.removeEventListener("click", cerrarMenu);
      }
    });
  }, 100);
}

// Función para ir al área personal
function irAreaPersonal() {
  // Cerrar menú
  const menu = document.querySelector(".menu-usuario-dropdown");
  if (menu) {
    menu.remove();
  }

  // Verificar que hay una sesión activa
  if (usuarioActual) {
    // Redirigir al área personal
    window.location.href = "area-personal.html";
  } else {
    mostrarError("Error: No hay sesión activa");
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  // Limpiar sesión
  limpiarSesion();

  // Restaurar botón de login original
  const botonLogin = document.querySelector(".boton-login");
  botonLogin.innerHTML = "Iniciar sesión";
  botonLogin.classList.remove("usuario-logueado");

  // Remover menú si existe
  const menu = document.querySelector(".menu-usuario-dropdown");
  if (menu) {
    menu.remove();
  }

  // Restaurar evento de click original para mostrar el modal de login
  botonLogin.removeEventListener("click", manejarClickMenuUsuario);
  botonLogin.addEventListener("click", manejarClickLogin);

  mostrarMensajeExito("Sesión cerrada correctamente");
}

// Función para verificar acceso al área personal (usar en area-personal.html)
function verificarAccesoAreaPersonal() {
  if (!verificarSesion()) {
    // No hay sesión activa, redirigir al index
    alert("Debes iniciar sesión para acceder al área personal");
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// Verificar sesión al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  console.log("Sistema de login inicializado");

  // Verificar si hay una sesión guardada
  verificarSesion();

  // Si estamos en área personal, verificar acceso
  if (window.location.pathname.includes("area-personal.html")) {
    verificarAccesoAreaPersonal();
  }
});

/* Estilos adicionales para las notificaciones y menú de usuario */
const estilosAdicionales = `
<style>
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

.notificacion-exito i {
    font-size: 1.2rem;
}

.usuario-logueado {
    background: linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
    border-color: rgba(16, 185, 129, 0.5) !important;
}

.menu-usuario-dropdown {
    background: rgba(134, 33, 33, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 200px;
    z-index: 10000;
    animation: aparecer 0.2s ease;
}

.menu-usuario-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
}

.menu-usuario-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.menu-usuario-item:first-child {
    border-radius: 8px 8px 0 0;
}

.menu-usuario-item:last-child {
    border-radius: 0 0 8px 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #ff6b6b;
}

@keyframes aparecer {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// Añadir estilos al head
document.head.insertAdjacentHTML("beforeend", estilosAdicionales);
