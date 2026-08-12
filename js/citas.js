/*
=========================================================
Sistema Hospitalario
citas.js
Gestión de citas médicas
Parte 1
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    if(document.getElementById("formCita")){

        cargarDoctores();

        document
            .getElementById("formCita")
            .addEventListener("submit", solicitarCita);

    }

    if(document.getElementById("tablaHistorial")){

        cargarHistorialPaciente();

    }

    if(document.getElementById("tablaCitas")){

        cargarTodasLasCitas();

    }

    actualizarDashboard();

});

/*==========================================
DOCTORES
==========================================*/

function cargarDoctores(){

    const select=document.getElementById("doctor");

    if(!select) return;

    select.innerHTML='<option value="">Seleccione</option>';

    const doctores=obtenerUsuarios()

    .filter(usuario=>usuario.rol==="Doctor");

    doctores.forEach(doctor=>{

        select.innerHTML+=`

        <option value="${doctor.id}">

            ${doctor.nombre} ${doctor.apellido}
            ${doctor.especialidad ? '- '+doctor.especialidad : ''}

        </option>

        `;

    });

}

/*==========================================
SOLICITAR CITA
==========================================*/

function solicitarCita(e){

    e.preventDefault();

    const sesion=obtenerSesion();

    if(!sesion){

        Swal.fire(
            "Error",
            "Debe iniciar sesión.",
            "error"
        );

        return;

    }

    const cita={

        id:Date.now(),

        pacienteId:sesion.id,

        paciente:sesion.nombre+" "+(sesion.apellido||""),

        doctorId:Number(document.getElementById("doctor").value),

        doctor:document.getElementById("doctor").selectedOptions[0].text,

        especialidad:document.getElementById("especialidad").value,

        fecha:document.getElementById("fecha").value,

        hora:document.getElementById("hora").value,

        estado:"Pendiente"

    };

    const citas=obtenerCitas();

    const repetida=citas.find(c=>

        c.doctorId===cita.doctorId &&

        c.fecha===cita.fecha &&

        c.hora===cita.hora &&

        c.estado!=="Cancelada"

    );

    if(repetida){

        Swal.fire(
            "Horario ocupado",
            "Seleccione otro horario.",
            "warning"
        );

        return;

    }

    citas.push(cita);

    guardarCitas(citas);

    document.getElementById("formCita").reset();

    Swal.fire({

        icon:"success",

        title:"Cita registrada",

        timer:1700,

        showConfirmButton:false

    });

    cargarHistorialPaciente();

    actualizarDashboard();

}

/*==========================================
HISTORIAL PACIENTE
==========================================*/

function cargarHistorialPaciente(){

    const tabla=document.getElementById("tablaHistorial");

    if(!tabla) return;

    tabla.innerHTML="";

    const sesion=obtenerSesion();

    const citas=obtenerCitas()

    .filter(c=>c.pacienteId===sesion.id);

    citas.forEach(cita=>{

        tabla.innerHTML+=`

        <tr>

        <td>${cita.id}</td>

        <td>${cita.doctor}</td>

        <td>${cita.especialidad}</td>

        <td>${cita.fecha}</td>

        <td>${cita.hora}</td>

        <td>

        <span class="badge bg-${
            colorEstado(cita.estado)
        }">

        ${cita.estado}

        </span>

        </td>

        <td>

        ${cita.estado==="Pendiente"

        ?`

        <button
        class="btn btn-danger btn-sm"
        onclick="cancelarCita(${cita.id})">

        Cancelar

        </button>

        `

        :""

        }

        </td>

        </tr>

        `;

    });

}

/*==========================================
CANCELAR
==========================================*/

function cancelarCita(id){

    Swal.fire({

        title:"Cancelar cita?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"Sí"

    }).then(resultado=>{

        if(!resultado.isConfirmed) return;

        actualizarEstadoCita(

            id,

            "Cancelada"

        );

        cargarHistorialPaciente();

        cargarTodasLasCitas();

        actualizarDashboard();

    });

}

/*==========================================
COLOR ESTADOS
==========================================*/

function colorEstado(estado){

    switch(estado){

        case "Pendiente":

            return "warning";

        case "Confirmada":

            return "primary";

        case "Atendida":

            return "success";

        case "Cancelada":

            return "danger";

        default:

            return "secondary";

    }

}
/*=========================================================
ADMINISTRADOR
TABLA GENERAL DE CITAS
=========================================================*/

function cargarTodasLasCitas(){

    const tabla=document.getElementById("tablaCitas");

    if(!tabla) return;

    tabla.innerHTML="";

    const citas=obtenerCitas();

    citas.forEach(cita=>{

        tabla.innerHTML+=`

        <tr>

            <td>${cita.id}</td>

            <td>${cita.paciente}</td>

            <td>${cita.doctor}</td>

            <td>${cita.fecha}</td>

            <td>${cita.hora}</td>

            <td>

                <span class="badge bg-${colorEstado(cita.estado)}">

                    ${cita.estado}

                </span>

            </td>

            <td>

                <div class="btn-group">

                    <button
                        class="btn btn-success btn-sm"
                        onclick="confirmarCita(${cita.id})">

                        Confirmar

                    </button>

                    <button
                        class="btn btn-primary btn-sm"
                        onclick="atenderCita(${cita.id})">

                        Atendida

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="cancelarCita(${cita.id})">

                        Cancelar

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

/*=========================================================
CONFIRMAR
=========================================================*/

function confirmarCita(id){

    Swal.fire({

        title:"¿Confirmar esta cita?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"Confirmar"

    }).then(result=>{

        if(!result.isConfirmed) return;

        actualizarEstadoCita(

            id,

            "Confirmada"

        );

        refrescarSistema();

    });

}

/*=========================================================
ATENDER
=========================================================*/

function atenderCita(id){

    Swal.fire({

        title:"¿Marcar como atendida?",

        icon:"success",

        showCancelButton:true,

        confirmButtonText:"Sí"

    }).then(result=>{

        if(!result.isConfirmed) return;

        actualizarEstadoCita(

            id,

            "Atendida"

        );

        refrescarSistema();

    });

}

/*=========================================================
DOCTOR
MIS CITAS
=========================================================*/

function cargarMisCitasDoctor(){

    const tabla=document.getElementById("tablaMisCitas");

    if(!tabla) return;

    tabla.innerHTML="";

    const sesion=obtenerSesion();

    const citas=obtenerCitas()

    .filter(cita=>cita.doctorId===sesion.id);

    citas.forEach(cita=>{

        tabla.innerHTML+=`

        <tr>

            <td>${cita.id}</td>

            <td>${cita.paciente}</td>

            <td>${cita.fecha}</td>

            <td>${cita.hora}</td>

            <td>

                <span class="badge bg-${colorEstado(cita.estado)}">

                    ${cita.estado}

                </span>

            </td>

            <td>

                ${cita.estado==="Confirmada"

                ?

                `<button

                    class="btn btn-success btn-sm"

                    onclick="atenderCita(${cita.id})">

                    Atender

                </button>`

                :

                ""

                }

            </td>

        </tr>

        `;

    });

}

/*=========================================================
DASHBOARD
=========================================================*/

function actualizarDashboard(){

    const citas=obtenerCitas();

    const pendientes=citas.filter(

        cita=>cita.estado==="Pendiente"

    ).length;

    const confirmadas=citas.filter(

        cita=>cita.estado==="Confirmada"

    ).length;

    const atendidas=citas.filter(

        cita=>cita.estado==="Atendida"

    ).length;

    const canceladas=citas.filter(

        cita=>cita.estado==="Cancelada"

    ).length;

    if(document.getElementById("totalPendientes"))

        document.getElementById("totalPendientes").textContent=pendientes;

    if(document.getElementById("totalCanceladas"))

        document.getElementById("totalCanceladas").textContent=canceladas;

    if(document.getElementById("citasPendientes"))

        document.getElementById("citasPendientes").textContent=pendientes;

    if(document.getElementById("citasAtendidas"))

        document.getElementById("citasAtendidas").textContent=atendidas;

    if(document.getElementById("proximasCitas"))

        document.getElementById("proximasCitas").textContent=

        pendientes+confirmadas;

    if(document.getElementById("citasCanceladas"))

        document.getElementById("citasCanceladas").textContent=canceladas;

}

/*=========================================================
BUSCADOR
=========================================================*/

function buscarCitas(texto){

    texto=texto.toLowerCase();

    return obtenerCitas().filter(cita=>

        cita.paciente.toLowerCase().includes(texto) ||

        cita.doctor.toLowerCase().includes(texto) ||

        cita.especialidad.toLowerCase().includes(texto)

    );

}

/*=========================================================
FILTRO POR ESTADO
=========================================================*/

function filtrarEstado(estado){

    if(estado==="Todos"){

        return obtenerCitas();

    }

    return obtenerCitas().filter(

        cita=>cita.estado===estado

    );

}

/*=========================================================
FILTRO POR FECHA
=========================================================*/

function filtrarFecha(fecha){

    return obtenerCitas().filter(

        cita=>cita.fecha===fecha

    );

}

/*=========================================================
RECARGAR TODAS LAS TABLAS
=========================================================*/

function refrescarSistema(){

    cargarHistorialPaciente();

    cargarTodasLasCitas();

    cargarMisCitasDoctor();

    actualizarDashboard();

}
/*=========================================================
citas.js
PARTE 3
Funciones avanzadas
=========================================================*/

/*==========================================
VALIDAR DISPONIBILIDAD MÉDICA
==========================================*/

function doctorDisponible(doctorId, fecha, hora){

    const disponibilidad = obtenerDisponibilidad();

    return disponibilidad.some(item =>

        Number(item.doctorId) === Number(doctorId) &&

        item.fecha === fecha &&

        hora >= item.horaInicio &&

        hora <= item.horaFin

    );

}

/*==========================================
VALIDAR HORARIO OCUPADO
==========================================*/

function horarioOcupado(doctorId, fecha, hora){

    return obtenerCitas().some(cita =>

        Number(cita.doctorId) === Number(doctorId) &&

        cita.fecha === fecha &&

        cita.hora === hora &&

        cita.estado !== "Cancelada"

    );

}

/*==========================================
OBTENER CITAS POR DOCTOR
==========================================*/

function obtenerCitasDoctor(id){

    return obtenerCitas().filter(cita =>

        Number(cita.doctorId) === Number(id)

    );

}

/*==========================================
OBTENER CITAS POR PACIENTE
==========================================*/

function obtenerCitasPaciente(id){

    return obtenerCitas().filter(cita =>

        Number(cita.pacienteId) === Number(id)

    );

}

/*==========================================
ESTADÍSTICAS DEL DOCTOR
==========================================*/

function actualizarDashboardDoctor(){

    const sesion = obtenerSesion();

    if(!sesion) return;

    const citas = obtenerCitasDoctor(sesion.id);

    const hoy = new Date().toISOString().slice(0,10);

    const hoyCantidad = citas.filter(c=>c.fecha===hoy).length;

    const pendientes = citas.filter(c=>c.estado==="Pendiente").length;

    const atendidas = citas.filter(c=>c.estado==="Atendida").length;

    if(document.getElementById("citasHoy"))
        document.getElementById("citasHoy").textContent = hoyCantidad;

    if(document.getElementById("citasPendientes"))
        document.getElementById("citasPendientes").textContent = pendientes;

    if(document.getElementById("citasAtendidas"))
        document.getElementById("citasAtendidas").textContent = atendidas;

}

/*==========================================
ESTADÍSTICAS PACIENTE
==========================================*/

function actualizarDashboardPaciente(){

    const sesion = obtenerSesion();

    if(!sesion) return;

    const citas = obtenerCitasPaciente(sesion.id);

    const pendientes = citas.filter(c=>c.estado==="Pendiente").length;

    const confirmadas = citas.filter(c=>c.estado==="Confirmada").length;

    const atendidas = citas.filter(c=>c.estado==="Atendida").length;

    const canceladas = citas.filter(c=>c.estado==="Cancelada").length;

    if(document.getElementById("proximasCitas"))
        document.getElementById("proximasCitas").textContent =
        pendientes + confirmadas;

    if(document.getElementById("citasAtendidas"))
        document.getElementById("citasAtendidas").textContent =
        atendidas;

    if(document.getElementById("citasCanceladas"))
        document.getElementById("citasCanceladas").textContent =
        canceladas;

}

/*==========================================
ORDENAR POR FECHA
==========================================*/

function ordenarCitasFecha(){

    const citas = obtenerCitas();

    citas.sort((a,b)=>{

        const fechaA = new Date(a.fecha+" "+a.hora);

        const fechaB = new Date(b.fecha+" "+b.hora);

        return fechaA-fechaB;

    });

    guardarCitas(citas);

}

/*==========================================
ELIMINAR CITAS CANCELADAS
==========================================*/

function limpiarCanceladas(){

    Swal.fire({

        title:"¿Eliminar citas canceladas?",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Eliminar"

    }).then(resultado=>{

        if(!resultado.isConfirmed) return;

        const citas = obtenerCitas()

        .filter(c=>c.estado!=="Cancelada");

        guardarCitas(citas);

        refrescarSistema();

        Swal.fire(

            "Proceso completado",

            "Las citas canceladas fueron eliminadas.",

            "success"

        );

    });

}

/*==========================================
EXPORTAR CITAS
==========================================*/

function exportarCitasJSON(){

    const datos = JSON.stringify(

        obtenerCitas(),

        null,

        2

    );

    const archivo = new Blob(

        [datos],

        {type:"application/json"}

    );

    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");

    enlace.href = url;

    enlace.download = "citas.json";

    enlace.click();

    URL.revokeObjectURL(url);

}

/*==========================================
IMPORTAR CITAS
==========================================*/

function importarCitas(event){

    const archivo = event.target.files[0];

    if(!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e){

        try{

            const datos = JSON.parse(e.target.result);

            guardarCitas(datos);

            refrescarSistema();

            Swal.fire(

                "Importación exitosa",

                "",

                "success"

            );

        }

        catch{

            Swal.fire(

                "Archivo inválido",

                "",

                "error"

            );

        }

    };

    lector.readAsText(archivo);

}

/*==========================================
INICIALIZACIÓN
==========================================*/

document.addEventListener("DOMContentLoaded",()=>{

    if(document.getElementById("tablaMisCitas")){

        cargarMisCitasDoctor();

        actualizarDashboardDoctor();

    }

    if(document.getElementById("tablaHistorial")){

        actualizarDashboardPaciente();

    }

    ordenarCitasFecha();

});