/*
=========================================================
Sistema Hospitalario
app.js
Archivo principal de la aplicación
=========================================================
*/

const APP = {

    nombre: "Sistema Hospitalario",

    version: "1.0.0",

    desarrollador: "Proyecto Académico"

};

/*=========================================================
INICIO DEL SISTEMA
=========================================================*/

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema(){

    console.log(APP.nombre);

    inicializarSistema();

    inicializarEventos();

    actualizarInterfaz();

    iniciarReloj();

    verificarSesion();

}

/*=========================================================
EVENTOS GENERALES
=========================================================*/

function inicializarEventos(){

    document.querySelectorAll("[data-ir]")

    .forEach(boton=>{

        boton.addEventListener("click",()=>{

            window.location.href=

            boton.dataset.ir;

        });

    });

}

/*=========================================================
ACTUALIZAR INTERFAZ
=========================================================*/

function actualizarInterfaz(){

    const sesion=obtenerSesion();

    if(!sesion) return;

    switch(sesion.rol){

        case "Administrador":

            if(typeof cargarUsuarios==="function")

                cargarUsuarios();

            if(typeof cargarTodasLasCitas==="function")

                cargarTodasLasCitas();

            if(typeof actualizarEstadisticas==="function")

                actualizarEstadisticas();

            if(typeof actualizarDashboard==="function")

                actualizarDashboard();

        break;

        case "Doctor":

            if(typeof cargarMisCitasDoctor==="function")

                cargarMisCitasDoctor();

            if(typeof cargarDisponibilidadDoctor==="function")

                cargarDisponibilidadDoctor();

            if(typeof actualizarPanelDoctor==="function")

                actualizarPanelDoctor();

        break;

        case "Paciente":

            if(typeof cargarHistorialPaciente==="function")

                cargarHistorialPaciente();

            if(typeof actualizarDashboardPaciente==="function")

                actualizarDashboardPaciente();

        break;

    }

}

/*=========================================================
VERIFICAR SESIÓN
=========================================================*/

function verificarSesion(){

    const pagina=

    location.pathname.split("/").pop();

    const publicas=[

        "index.html",

        "login.html",

        "registro.html",

        ""

    ];

    if(publicas.includes(pagina))

        return;

    const sesion=

        obtenerSesion();

    if(!sesion){

        window.location.href="login.html";

    }

}

/*=========================================================
RELOJ
=========================================================*/

function iniciarReloj(){

    const reloj=

        document.getElementById("relojSistema");

    if(!reloj) return;

    actualizarReloj();

    setInterval(

        actualizarReloj,

        1000

    );

}

function actualizarReloj(){

    const reloj=

        document.getElementById("relojSistema");

    if(!reloj) return;

    const ahora=

        new Date();

    reloj.textContent=

        ahora.toLocaleString();

}

/*=========================================================
MENSAJES
=========================================================*/

function mensajeExito(texto){

    Swal.fire({

        icon:"success",

        title:texto,

        timer:1600,

        showConfirmButton:false

    });

}

function mensajeError(texto){

    Swal.fire({

        icon:"error",

        title:texto

    });

}

function mensajeAdvertencia(texto){

    Swal.fire({

        icon:"warning",

        title:texto

    });

}



function mostrarCarga(){

    Swal.fire({

        title:"Procesando...",

        allowOutsideClick:false,

        didOpen:()=>{

            Swal.showLoading();

        }

    });

}

function ocultarCarga(){

    Swal.close();

}



function fechaActual(){

    return new Date()

    .toISOString()

    .slice(0,10);

}

function horaActual(){

    return new Date()

    .toLocaleTimeString(

        "es-CO",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}



function respaldoSistema(){

    const datos={

        usuarios:

        obtenerUsuarios(),

        citas:

        obtenerCitas(),

        disponibilidad:

        obtenerDisponibilidad(),

        fecha:

        new Date()

    };

    const blob=

        new Blob(

            [

                JSON.stringify(

                    datos,

                    null,

                    2

                )

            ],

            {

                type:

                "application/json"

            }

        );

    const enlace=

        document.createElement("a");

    enlace.href=

        URL.createObjectURL(blob);

    enlace.download=

        "backup_hospital.json";

    enlace.click();

}


function restaurarSistema(json){

    guardarUsuarios(

        json.usuarios||[]

    );

    guardarCitas(

        json.citas||[]

    );

    guardarDisponibilidad(

        json.disponibilidad||[]

    );

    actualizarInterfaz();

}

/
function reiniciarSistema(){

    Swal.fire({

        title:"¿Reiniciar sistema?",

        text:"Se eliminarán todos los datos.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Reiniciar"

    })

    .then(respuesta=>{

        if(!respuesta.isConfirmed)

            return;

        limpiarBaseDatos();

        inicializarSistema();

        actualizarInterfaz();

        mensajeExito(

            "Sistema reiniciado."

        );

    });

}


setInterval(()=>{

    actualizarInterfaz();

},10000);



console.log(

    APP.nombre+

    " v"+

    APP.version+

    " iniciado."

);