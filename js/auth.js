/*
=========================================================
Sistema Hospitalario
auth.js
Autenticación y control de sesiones
=========================================================
*/

const SESSION_KEY = "hospital_sesion";

/*=========================================
OBTENER SESIÓN
=========================================*/

function obtenerSesion() {

    return JSON.parse(localStorage.getItem(SESSION_KEY));

}

/*=========================================
GUARDAR SESIÓN
=========================================*/

function guardarSesion(usuario) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(usuario)
    );

}

/*=========================================
CERRAR SESIÓN
=========================================*/

function cerrarSesion() {

    localStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";

}

/*=========================================
LOGIN
=========================================*/

function iniciarSesion(correo, password, rol) {

    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(u =>

        u.correo === correo &&
        u.password === password &&
        u.rol === rol

    );

    if (!usuario) {

        alert("Correo, contraseña o rol incorrecto.");

        return false;

    }

    guardarSesion(usuario);

    switch (usuario.rol) {

        case "Administrador":

            window.location.href = "admin.html";

            break;

        case "Doctor":

            window.location.href = "doctor.html";

            break;

        case "Paciente":

            window.location.href = "paciente.html";

            break;

    }

}

/*=========================================
REGISTRO PACIENTE
=========================================*/

function registrarPaciente(datos) {

    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(

        usuario => usuario.correo === datos.correo

    );

    if (existe) {

        alert("El correo ya está registrado.");

        return false;

    }

    datos.id = Date.now();

    datos.rol = "Paciente";

    usuarios.push(datos);

    guardarUsuarios(usuarios);

    alert("Registro exitoso.");

    window.location.href = "login.html";

}

/*=========================================
VALIDAR SESIÓN
=========================================*/

function validarSesion(rolEsperado) {

    const sesion = obtenerSesion();

    if (!sesion) {

        window.location.href = "login.html";

        return;

    }

    if (sesion.rol !== rolEsperado) {

        alert("Acceso denegado.");

        cerrarSesion();

    }

}

/*=========================================
MOSTRAR NOMBRE DEL USUARIO
=========================================*/

function cargarNombreUsuario() {

    const sesion = obtenerSesion();

    if (!sesion) return;

    const doctor = document.getElementById("doctorNombre");
    const paciente = document.getElementById("pacienteNombre");

    if (doctor) {

        doctor.textContent =

            sesion.nombre + " " + sesion.apellido;

    }

    if (paciente) {

        paciente.textContent =

            sesion.nombre + " " + sesion.apellido;

    }

}

/*=========================================
EVENTOS LOGIN
=========================================*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        iniciarSesion(

            document.getElementById("correo").value,

            document.getElementById("password").value,

            document.getElementById("rol").value

        );

    });

}

/*=========================================
EVENTOS REGISTRO
=========================================*/

const registroForm = document.getElementById("registroForm");

if (registroForm) {

    registroForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const password = document.getElementById("password").value;

        const confirmar = document.getElementById("confirmarPassword").value;

        if (password !== confirmar) {

            alert("Las contraseñas no coinciden.");

            return;

        }

        registrarPaciente({

            nombre: document.getElementById("nombre").value,

            apellido: document.getElementById("apellido").value,

            documento: document.getElementById("documento").value,

            edad: document.getElementById("edad").value,

            telefono: document.getElementById("telefono").value,

            direccion: document.getElementById("direccion").value,

            correo: document.getElementById("correo").value,

            password: password

        });

    });

}

/*=========================================
BOTÓN LOGOUT
=========================================*/

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", cerrarSesion);

}

/*=========================================
VALIDACIONES AUTOMÁTICAS
=========================================*/

if (location.pathname.includes("admin.html")) {

    validarSesion("Administrador");

}

if (location.pathname.includes("doctor.html")) {

    validarSesion("Doctor");

}

if (location.pathname.includes("paciente.html")) {

    validarSesion("Paciente");

}

cargarNombreUsuario();