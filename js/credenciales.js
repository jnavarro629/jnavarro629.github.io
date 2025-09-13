// credenciales.js - Base de datos de usuarios del club
const usuariosClub = {
  admin: {
    password: "admin123",
    nombre: "Administrador",
    rol: "admin",
  },
  entrenador1: {
    password: "coach2024",
    nombre: "Juan Pérez",
    rol: "entrenador",
  },
  miembro1: {
    password: "tenis123",
    nombre: "María García",
    rol: "miembro",
  },
  socio001: {
    password: "padel456",
    nombre: "Carlos López",
    rol: "miembro",
  },
};

// Función para validar credenciales
function validarCredenciales(usuario, password) {
  if (usuariosClub[usuario] && usuariosClub[usuario].password === password) {
    return {
      valido: true,
      usuario: usuariosClub[usuario],
    };
  }
  return {
    valido: false,
    mensaje: "Usuario o contraseña incorrectos",
  };
}

// Función para añadir nuevos usuarios (solo para administradores)
function agregarUsuario(nuevoUsuario, datos) {
  if (!usuariosClub[nuevoUsuario]) {
    usuariosClub[nuevoUsuario] = datos;
    return true;
  }
  return false; // El usuario ya existe
}
