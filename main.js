class Persona
{
    constructor(id, nombre, apellido, fechaNacimiento)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString()
    {
        return `ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Fecha de Nacimiento: ${this.fechaNacimiento}`;
    }
}

class Ciudadano extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, dni)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }

    toString()
    {
        return `${super.toString()}, Dni: ${this.dni}`;
    }
}

class Extranjero extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }

    toString()
    {
        return `${super.toString()}, Pais de Origen: ${this.paisOrigen}`;
    }
}

const API_URL = "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero";

let LISTAPERSONAS = [];

let boolEliminar = false;

function $(id){return document.getElementById(id)}

document.addEventListener("DOMContentLoaded", function (){
    mostrarListaPersonas();
});

function mostrarListaPersonas()
{
    mostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            LISTAPERSONAS = JSON.parse(xhr.responseText);
            renderizarTabla();
        }
        
        ocultarSpinner();
    };

    xhr.send();
}

function renderizarTabla()
{
    let tabla = document.querySelector("#tablaPersonas tbody");

    borrarTd();

    LISTAPERSONAS.forEach(function(cliente) {
        let fila = document.createElement("tr");
        
        let columnaId = document.createElement("td");
        columnaId.textContent = cliente.id; 
        fila.appendChild(columnaId);
        
        let columnaNombre = document.createElement("td");
        columnaNombre.textContent = cliente.nombre;
        fila.appendChild(columnaNombre);
        
        let columnaApellido = document.createElement("td");
        columnaApellido.textContent = cliente.apellido;
        fila.appendChild(columnaApellido);

        let columnaFechaNacimiento = document.createElement("td");
        columnaFechaNacimiento.textContent = cliente.fechaNacimiento;
        fila.appendChild(columnaFechaNacimiento);

        let columnaDni = document.createElement("td");
        columnaDni.textContent = cliente.dni;
        fila.appendChild(columnaDni);

        let columnaPaisOrigen = document.createElement("td");
        columnaPaisOrigen.textContent = cliente.paisOrigen ;
        fila.appendChild(columnaPaisOrigen);
        
        let columnaBotones = document.createElement("td");
        let botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        //MODIFICAR
        botonModificar.addEventListener("click", function() {
            console.log("Click modificar " + cliente.id);
            
            mostrarAbm(cliente);
        });

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        //ELIMINAR
        botonEliminar.addEventListener("click", function() {
            console.log("Click eliminar " + cliente.id);

            boolEliminar = true;

            mostrarAbm(cliente);
        });

        columnaBotones.appendChild(botonModificar);
        columnaBotones.appendChild(botonEliminar);
        
        fila.appendChild(columnaBotones);
        tabla.appendChild(fila);
    });
}

//BOTON AGREGAR ELEMENTO
$("btnAgregar").addEventListener("click", function() {
    mostrarAbm();

    $("selectTipo").addEventListener("change", function (){
        let tipo = this.value;
        actualizarVisibilidadCampos(tipo);

        $("abmDni").value = "";
        $("abmPaisOrigen").value = "";

        console.log(tipo);
    });
});

//BOTON ACEPTAR EN ABM
$("btnAceptar").addEventListener("click", () => {
    console.log("Click aceptar abm");

    if(boolEliminar)
    {
        eliminarPersona({
            id: $("abmId").value,
            nombre: $("abmNombre").value,
            apellido: $("abmApellido").value,
            fechaNacimiento: $("abmFechaNacimiento").value,
            tipo: $("selectTipo").value,
            dni: $("abmDni").value,
            paisOrigen: $("abmPaisOrigen").value,
        });

        boolEliminar = false;

        ocultarAbm();
    }
    else
    {
        let nuevaPersona = {
            id: $("abmId").value,
            nombre: $("abmNombre").value,
            apellido: $("abmApellido").value,
            fechaNacimiento: $("abmFechaNacimiento").value,
            tipo: $("selectTipo").value,
            dni: $("abmDni").value,
            paisOrigen: $("abmPaisOrigen").value,
        };

        /*VERIFICAR BIEN!!*/

        // if (nuevaPersona.nombre == "" || nuevaPersona.apellido == "" || nuevaPersona.fechaNacimiento < 15)
        // {
        //     alert("Complete los campos Nombre, Apellido o Edad correctamente");
        //     return;
        // }

        // if (nuevaPersona.tipo === "Ciudadano") 
        // {
        //     if (nuevaPersona.sueldo == "" || nuevaPersona.sueldo < 0 || nuevaPersona.ventas == "" || nuevaPersona.ventas < 0)
        //     {
        //         alert("Complete los datos Sueldo o Ventas correctamente");
        //         return;
        //     }
        // }

        // if (nuevaPersona.tipo === "Extranjero")
        // {
        //     if (nuevaPersona.compras == "" || nuevaPersona.compras < 0 || nuevaPersona.telefono == "")
        //     {
        //         alert("Complete los datos Compras o Telefono correctamente");
        //         return;
        //     }
        // }

        if (nuevaPersona.id)
        {
            actualizarPersona(nuevaPersona);

            renderizarTabla();
            ocultarAbm();
        }
        else
        {
            insertarPersona(nuevaPersona);

            renderizarTabla();
            ocultarAbm();
        }
    }
});

//BOTON CANCELAR ABM 
$("btnCancelar").addEventListener("click", function() {
    ocultarAbm();
    borrarTd();
    renderizarTabla();
});

function mostrarAbm(persona = null)
{
    $("formularioAbm").style.display = "block";
    $("formularioLista").style.display = "none";

    let tipo = $("selectTipo");

    if (persona)
    {
        $("selectTipo").disabled = true;

        $("abmId").value = persona.id;
        $("abmNombre").value = persona.nombre;
        $("abmApellido").value = persona.apellido;
        $("abmFechaNacimiento").value = persona.fechaNacimiento;
        if (persona.dni)
        {
            tipo.value = "Ciudadano";
        }
        else
        {
            tipo.value = "Extranjero";
        }
        $("abmDni").value = persona.dni;
        $("abmPaisOrigen").value = persona.paisOrigen;
        
        actualizarVisibilidadCampos(tipo.value);
    }
    else
    {
        $("abmId").value = "";
        $("abmNombre").value = "";
        $("abmApellido").value = "";
        $("abmFechaNacimiento").value = "";
        $("selectTipo").value = "";
        $("abmDni").value = "";
        $("abmPaisOrigen").value = "";

        $("selectTipo").disabled = false;

        actualizarVisibilidadCampos(tipo.value);
    }
}

function ocultarAbm()
{
    $("formularioAbm").style.display = "none";
    $("formularioLista").style.display = "block";

    renderizarTabla();
}

function actualizarVisibilidadCampos(tipo)
{
    let divCiudadano = $("ciudadano");
    let divExtranjero = $("extranjero");

    if (tipo === "Ciudadano")
    {
        divCiudadano.style.display = "block";
        divExtranjero.style.display = "none";
    }
    else
    {
        divCiudadano.style.display = "none";
        divExtranjero.style.display = "block";
    }
}

async function actualizarPersona(nuevaPersona)
{
    console.log("Async");

    mostrarSpinner();

    try
    {
        let respuesta = await fetch(API_URL, {
            method: "POST", //MODIFICAR
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(nuevaPersona)
        });

        let index = LISTAPERSONAS.findIndex(persona => persona.id == nuevaPersona.id);
        if (index !== -1)
        {
            LISTAPERSONAS[index].nombre = nuevaPersona.nombre;
            LISTAPERSONAS[index].apellido = nuevaPersona.apellido;
            LISTAPERSONAS[index].fechaNacimiento = nuevaPersona.fechaNacimiento;
            if (nuevaPersona.tipo === "Ciudadano")
            {
                LISTAPERSONAS[index].dni = nuevaPersona.dni;
            }
            if (nuevaPersona.tipo === "Extranjero")
            {
                LISTAPERSONAS[index].paisOrigen = nuevaPersona.paisOrigen;
            }
        }

        ocultarAbm();
    }
    catch (error)
    {
        console.error(error.message);
        ocultarAbm();
    }
    finally
    {
        ocultarSpinner();
    }
}

function insertarPersona(nuevaPersona)
{
    mostrarSpinner();

    let put = {
        method: "PUT", //AGREGAR
        headers: {
         "Content-type": "application/json; charset=UTF-8" 
        },
        body: JSON.stringify(nuevaPersona)
    }
    
    fetch(API_URL, put)
    .then(respuesta => respuesta.json())
    .then(data => {
        nuevaPersona.id = data.id;

        LISTAPERSONAS.push(nuevaPersona);

        ocultarAbm();
        renderizarTabla();
    })
    .catch(error => {
        console.error(error.message);

        ocultarAbm();
        renderizarTabla();
    })
    .finally(function (){
        ocultarSpinner();
    });
}

function eliminarPersona(cliente)
{
    console.log("Funcion Eliminar");

    mostrarSpinner();

    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", API_URL);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.status === 200)
        {
            let index = LISTAPERSONAS.findIndex(persona => persona.id == cliente.id);

            if (index !== -1)
            {
                LISTAPERSONAS.splice(index, 1);
            }

            renderizarTabla();
            ocultarSpinner();
        }
        else
        {
            console.error("Error al eliminar");
            
            ocultarSpinner();
        }
    };

    xhr.send(JSON.stringify({ id: cliente.id }));
}

function borrarTd()
{
    document.querySelectorAll("tbody td").forEach(cell => {
        cell.remove();

        console.log("BORRE!");
    });
}

function mostrarSpinner()
{
    $("spinner").parentNode.style.display = "flex";
}

function ocultarSpinner()
{
    $("spinner").parentNode.style.display = "none";
}