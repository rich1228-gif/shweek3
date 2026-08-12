/*
=========================================================
Sistema Hospitalario
doctor.js
Panel del Médico
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    if(!document.getElementById("formDisponibilidad")) return;

    cargarDisponibilidadDoctor();

    document

        .getElementById("formDisponibilidad")

        .addEventListener(

            "submit",

            guardarDisponibilidadDoctor

        );

});

/*=====================================================
GUARDAR DISPONIBILIDAD
=====================================================*/

function guardarDisponibilidadDoctor(e){

    e.preventDefault();

    const sesion = obtenerSesion();

    if(!sesion){

        Swal.fire(

            "Error",

            "Debe iniciar sesión.",

            "error"

        );

        return;

    }

    const fecha =

        document.getElementById("fechaDisponible").value;

    const horaInicio =

        document.getElementById("horaInicio").value;

    const horaFin =

        document.getElementById("horaFin").value;

    if(horaInicio >= horaFin){

        Swal.fire(

            "Horario inválido",

            "La hora final debe ser mayor.",

            "warning"

        );

        return;

    }

    const lista = obtenerDisponibilidad();

    const existe = lista.some(item=>

        item.doctorId===sesion.id &&

        item.fecha===fecha &&

        item.horaInicio===horaInicio

    );

    if(existe){

        Swal.fire(

            "Ya existe",

            "Ese horario ya fue registrado.",

            "info"

        );

        return;

    }

    agregarDisponibilidad({

        doctorId:sesion.id,

        doctor:sesion.nombre+" "+sesion.apellido,

        fecha,

        horaInicio,

        horaFin

    });

    document

        .getElementById("formDisponibilidad")

        .reset();

    cargarDisponibilidadDoctor();

    Swal.fire({

        icon:"success",

        title:"Disponibilidad registrada",

        timer:1500,

        showConfirmButton:false

    });

}

/*=====================================================
TABLA DISPONIBILIDAD
=====================================================*/

function cargarDisponibilidadDoctor(){

    let tabla =

        document.getElementById("tablaDisponibilidad");

    if(!tabla) return;

    tabla.innerHTML="";

    const sesion=obtenerSesion();

    const lista=

        obtenerDisponibilidad()

        .filter(item=>

            item.doctorId===sesion.id

        );

    lista.forEach(item=>{

        tabla.innerHTML+=`

        <tr>

        <td>${item.fecha}</td>

        <td>${item.horaInicio}</td>

        <td>${item.horaFin}</td>

        <td>

        <button

        class="btn btn-danger btn-sm"

        onclick="eliminarDisponibilidad(${item.id})">

        Eliminar

        </button>

        </td>

        </tr>

        `;

    });

}

/*=====================================================
ELIMINAR DISPONIBILIDAD
=====================================================*/

function eliminarDisponibilidad(id){

    Swal.fire({

        title:"Eliminar disponibilidad?",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Eliminar"

    }).then(resultado=>{

        if(!resultado.isConfirmed) return;

        let lista=

            obtenerDisponibilidad();

        lista=

            lista.filter(

                item=>item.id!==id

            );

        guardarDisponibilidad(lista);

        cargarDisponibilidadDoctor();

    });

}

/*=====================================================
MIS CITAS DEL DÍA
=====================================================*/

function obtenerCitasHoy(){

    const hoy=

        new Date()

        .toISOString()

        .slice(0,10);

    const sesion=

        obtenerSesion();

    return obtenerCitas()

    .filter(cita=>

        cita.doctorId===sesion.id &&

        cita.fecha===hoy

    );

}

/*=====================================================
SIGUIENTE PACIENTE
=====================================================*/

function siguientePaciente(){

    const citas=

        obtenerCitasHoy()

        .filter(cita=>

            cita.estado==="Confirmada"

        )

        .sort((a,b)=>

            a.hora.localeCompare(b.hora)

        );

    return citas.length ?

        citas[0]

        :

        null;

}

/*=====================================================
MOSTRAR SIGUIENTE PACIENTE
=====================================================*/

function actualizarSiguientePaciente(){

    const paciente=

        siguientePaciente();

    const contenedor=

        document.getElementById("siguientePaciente");

    if(!contenedor) return;

    if(!paciente){

        contenedor.innerHTML=

        "No hay pacientes.";

        return;

    }

    contenedor.innerHTML=`

        <strong>

        ${paciente.paciente}

        </strong>

        <br>

        ${paciente.fecha}

        <br>

        ${paciente.hora}

    `;

}

/*=====================================================
ESTADÍSTICAS
=====================================================*/

function actualizarPanelDoctor(){

    const sesion=

        obtenerSesion();

    if(!sesion) return;

    const citas=

        obtenerCitas()

        .filter(c=>

            c.doctorId===sesion.id

        );

    const hoy=

        new Date()

        .toISOString()

        .slice(0,10);

    const hoyTotal=

        citas.filter(c=>

            c.fecha===hoy

        ).length;

    const pendientes=

        citas.filter(c=>

            c.estado==="Pendiente"

        ).length;

    const atendidas=

        citas.filter(c=>

            c.estado==="Atendida"

        ).length;

    if(document.getElementById("citasHoy"))

        document.getElementById("citasHoy")

        .textContent=hoyTotal;

    if(document.getElementById("citasPendientes"))

        document.getElementById("citasPendientes")

        .textContent=pendientes;

    if(document.getElementById("citasAtendidas"))

        document.getElementById("citasAtendidas")

        .textContent=atendidas;

    actualizarSiguientePaciente();

}

/*=====================================================
ACTUALIZAR AUTOMÁTICAMENTE
=====================================================*/

setInterval(()=>{

    actualizarPanelDoctor();

},5000);