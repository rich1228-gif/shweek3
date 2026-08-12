/*
====================================================
Sistema Hospitalario
usuarios.js
CRUD completo de usuarios
====================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("tablaUsuarios")) return;

    cargarUsuarios();

    actualizarEstadisticas();

});

/*==========================================
CARGAR TABLA
==========================================*/

function cargarUsuarios() {

    const tabla = document.getElementById("tablaUsuarios");

    if (!tabla) return;

    tabla.innerHTML = "";

    const usuarios = obtenerUsuarios();

    usuarios.forEach(usuario => {

        tabla.innerHTML += `

        <tr>

            <td>${usuario.id}</td>

            <td>${usuario.nombre} ${usuario.apellido ?? ""}</td>

            <td>${usuario.correo}</td>

            <td>

                <span class="badge bg-primary">

                    ${usuario.rol}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editarUsuario(${usuario.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarUsuarioSistema(${usuario.id})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*==========================================
GUARDAR USUARIO
==========================================*/

const formUsuario = document.getElementById("formUsuario");

if (formUsuario) {

    formUsuario.addEventListener("submit", guardarNuevoUsuario);

}

const btnGuardar = document.getElementById("guardarUsuario");

if (btnGuardar) {

    btnGuardar.addEventListener("click", () => {

        formUsuario.requestSubmit();

    });

}

function guardarNuevoUsuario(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombreUsuario").value.trim();

    const correo = document.getElementById("correoUsuario").value.trim();

    const password = document.getElementById("passwordUsuario").value;

    const rol = document.getElementById("rolUsuario").value;

    if (!nombre || !correo || !password) {

        alert("Complete todos los campos.");

        return;

    }

    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(

        u => u.correo.toLowerCase() === correo.toLowerCase()

    );

    if (existe) {

        alert("Ese correo ya está registrado.");

        return;

    }

    const nuevo = {

        id: Date.now(),

        nombre,

        apellido: "",

        correo,

        password,

        rol

    };

    usuarios.push(nuevo);

    guardarUsuarios(usuarios);

    bootstrap.Modal.getInstance(
        document.getElementById("modalUsuario")
    ).hide();

    formUsuario.reset();

    cargarUsuarios();

    actualizarEstadisticas();

}

/*==========================================
EDITAR
==========================================*/

function editarUsuario(id) {

    const usuario = obtenerUsuarioPorId(id);

    if (!usuario) return;

    const nuevoNombre = prompt(

        "Nombre del usuario",

        usuario.nombre

    );

    if (nuevoNombre === null) return;

    const nuevoCorreo = prompt(

        "Correo",

        usuario.correo

    );

    if (nuevoCorreo === null) return;

    actualizarUsuario(id, {

        nombre: nuevoNombre,

        correo: nuevoCorreo

    });

    cargarUsuarios();

}

/*==========================================
ELIMINAR
==========================================*/

function eliminarUsuarioSistema(id) {

    const confirmar = confirm(

        "¿Desea eliminar este usuario?"

    );

    if (!confirmar) return;

    eliminarUsuario(id);

    cargarUsuarios();

    actualizarEstadisticas();

}

/*==========================================
ESTADÍSTICAS
==========================================*/

function actualizarEstadisticas() {

    const usuarios = obtenerUsuarios();

    const pacientes = usuarios.filter(

        u => u.rol === "Paciente"

    ).length;

    const doctores = usuarios.filter(

        u => u.rol === "Doctor"

    ).length;

    document.getElementById("totalPacientes").textContent = pacientes;

    document.getElementById("totalDoctores").textContent = doctores;

}

/*==========================================
BUSCADOR (PREPARADO)
==========================================*/

function buscarUsuarios(texto) {

    texto = texto.toLowerCase();

    const usuarios = obtenerUsuarios();

    return usuarios.filter(usuario =>

        usuario.nombre.toLowerCase().includes(texto) ||

        usuario.correo.toLowerCase().includes(texto)

    );

}