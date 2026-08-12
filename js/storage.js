/*
=========================================================
Sistema Hospitalario
storage.js

Manejo completo de LocalStorage
=========================================================
*/

const DB = {

    usuarios: "hospital_usuarios",

    citas: "hospital_citas",

    disponibilidad: "hospital_disponibilidad"

};

/*==================================================
INICIALIZAR BASE DE DATOS
==================================================*/

function inicializarSistema(){

    if(!localStorage.getItem(DB.usuarios)){

        const usuarios=[

            {
                id:1,
                nombre:"Administrador",
                apellido:"Sistema",
                documento:"1000000",
                correo:"admin@hospital.com",
                password:"123456",
                rol:"Administrador"
            },

            {
                id:2,
                nombre:"Juan",
                apellido:"Pérez",
                documento:"10101010",
                correo:"doctor@hospital.com",
                password:"123456",
                rol:"Doctor",
                especialidad:"Medicina General"
            },

            {
                id:3,
                nombre:"Carlos",
                apellido:"Ramírez",
                documento:"20202020",
                correo:"paciente@hospital.com",
                password:"123456",
                rol:"Paciente"
            }

        ];

        localStorage.setItem(

            DB.usuarios,

            JSON.stringify(usuarios)

        );

    }

    if(!localStorage.getItem(DB.citas)){

        localStorage.setItem(

            DB.citas,

            JSON.stringify([])

        );

    }

    if(!localStorage.getItem(DB.disponibilidad)){

        localStorage.setItem(

            DB.disponibilidad,

            JSON.stringify([])

        );

    }

}

/*==================================================
USUARIOS
==================================================*/

function obtenerUsuarios(){

    return JSON.parse(

        localStorage.getItem(DB.usuarios)

    ) || [];

}

function guardarUsuarios(lista){

    localStorage.setItem(

        DB.usuarios,

        JSON.stringify(lista)

    );

}

function agregarUsuario(usuario){

    const usuarios=obtenerUsuarios();

    usuario.id=Date.now();

    usuarios.push(usuario);

    guardarUsuarios(usuarios);

}

function actualizarUsuario(id,data){

    let usuarios=obtenerUsuarios();

    usuarios=usuarios.map(usuario=>{

        if(usuario.id==id){

            return{

                ...usuario,

                ...data

            };

        }

        return usuario;

    });

    guardarUsuarios(usuarios);

}

function eliminarUsuario(id){

    const usuarios=obtenerUsuarios()

    .filter(usuario=>usuario.id!=id);

    guardarUsuarios(usuarios);

}

/*==================================================
CITAS
==================================================*/

function obtenerCitas(){

    return JSON.parse(

        localStorage.getItem(DB.citas)

    ) || [];

}

function guardarCitas(lista){

    localStorage.setItem(

        DB.citas,

        JSON.stringify(lista)

    );

}

function agregarCita(cita){

    const citas=obtenerCitas();

    cita.id=Date.now();

    cita.estado="Pendiente";

    citas.push(cita);

    guardarCitas(citas);

}

function actualizarEstadoCita(id,estado){

    let citas=obtenerCitas();

    citas=citas.map(cita=>{

        if(cita.id==id){

            cita.estado=estado;

        }

        return cita;

    });

    guardarCitas(citas);

}

function eliminarCita(id){

    const citas=obtenerCitas()

    .filter(cita=>cita.id!=id);

    guardarCitas(citas);

}

/*==================================================
DISPONIBILIDAD MÉDICA
==================================================*/

function obtenerDisponibilidad(){

    return JSON.parse(

        localStorage.getItem(DB.disponibilidad)

    ) || [];

}

function guardarDisponibilidad(lista){

    localStorage.setItem(

        DB.disponibilidad,

        JSON.stringify(lista)

    );

}

function agregarDisponibilidad(item){

    const lista=obtenerDisponibilidad();

    item.id=Date.now();

    lista.push(item);

    guardarDisponibilidad(lista);

}

/*==================================================
UTILIDADES
==================================================*/

function obtenerUsuarioPorCorreo(correo){

    return obtenerUsuarios()

    .find(usuario=>usuario.correo===correo);

}

function obtenerUsuarioPorId(id){

    return obtenerUsuarios()

    .find(usuario=>usuario.id==id);

}

function limpiarBaseDatos(){

    localStorage.removeItem(DB.usuarios);

    localStorage.removeItem(DB.citas);

    localStorage.removeItem(DB.disponibilidad);

}

/*==================================================
INICIAR
==================================================*/

inicializarSistema();