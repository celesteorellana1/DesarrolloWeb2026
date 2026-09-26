/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * TODO: implementa las funciones marcadas. La API exige el header
 * `x-api-key` en las operaciones de escritura (POST, PUT, DELETE).
 */

const API = '/alumnos';
const API_KEY = 'umg-2026'; // debe coincidir con config.env

// Helper ya resuelto: cabeceras para las peticiones
const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

// Referencias del DOM (ya resueltas)
const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;
let idAEliminar = null;

/**
 * TODO: GET /alumnos y pinta las filas en la tabla.
 * Cada fila debe incluir botones "Editar" y "Eliminar".
 */
async function cargarAlumnos() {
    try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los alumnos');
        }

        const alumnos = await respuesta.json();

        tabla.innerHTML = '';

        alumnos.forEach((alumno, indice) => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${indice + 1}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellido}</td>
                <td>${alumno.email}</td>
                <td>${alumno.edad ?? ''}</td>
                <td>
                    <button type="button" data-editar="${alumno.id}">Editar</button>
                    <button type="button" data-eliminar="${alumno.id}">Eliminar</button>
                </td>
            `;

            tabla.appendChild(fila);
        });
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

/**
 * TODO: limpia el formulario, pone el título "Nuevo alumno",
 * idEnEdicion = null y abre dialogoForm con showModal().
 */
function abrirDialogoNuevo() {
    form.reset();
    idEnEdicion = null;
    tituloForm.textContent = 'Nuevo alumno';
    dialogoForm.showModal();
}

/**
 * TODO: precarga los datos del alumno en el formulario,
 * guarda su id en idEnEdicion, cambia el título a "Editar alumno"
 * y abre dialogoForm.
 */
async function abrirDialogoEditar(id) {
    try {
        const respuesta = await fetch(`${API}/${id}`);

        if (!respuesta.ok) {
            throw new Error('No se pudo obtener el alumno');
        }

        const alumno = await respuesta.json();

        idEnEdicion = id;
        tituloForm.textContent = 'Editar alumno';

        form.elements.nombre.value = alumno.nombre;
        form.elements.apellido.value = alumno.apellido;
        form.elements.email.value = alumno.email;
        form.elements.edad.value = alumno.edad ?? '';

        dialogoForm.showModal();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

/**
 * TODO: lee los campos del formulario y llama a la API.
 *   - Si idEnEdicion es null → POST /alumnos            (201)
 *   - Si hay id             → PUT /alumnos/:id          (200)
 * Usa cabeceras() y JSON.stringify(). Al terminar: cierra el dialog,
 * recarga la lista y muestra un mensaje.
 */
async function guardarAlumno(event) {
    event.preventDefault();

    const datos = {
        nombre: form.elements.nombre.value.trim(),
        apellido: form.elements.apellido.value.trim(),
        email: form.elements.email.value.trim(),
    };

    if (form.elements.edad.value !== '') {
        datos.edad = Number(form.elements.edad.value);
    }

    const esEdicion = idEnEdicion !== null;
    const url = esEdicion ? `${API}/${idEnEdicion}` : API;
    const metodo = esEdicion ? 'PUT' : 'POST';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: cabeceras(),
            body: JSON.stringify(datos),
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo guardar el alumno');
        }

        dialogoForm.close();
        await cargarAlumnos();

        mostrarMensaje(
            esEdicion
                ? 'Alumno actualizado correctamente'
                : 'Alumno creado correctamente'
        );
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

/**
 * TODO: abre dialogoEliminar guardando el id, y al confirmar hace
 * DELETE /alumnos/:id con cabeceras(false). Luego recarga y avisa.
 */
function eliminarAlumno(id) {
    idAEliminar = id;

    const fila = document.querySelector(`[data-eliminar="${id}"]`)?.closest('tr');

    if (fila) {
        const nombre = fila.children[1].textContent;
        const apellido = fila.children[2].textContent;
        nombreEliminar.textContent = `${nombre} ${apellido}`;
    }

    dialogoEliminar.showModal();
}

/**
 * Elimina un alumno mediante DELETE.
 */
async function ejecutarEliminar() {
    try {
        const respuesta = await fetch(`${API}/${idAEliminar}`, {
            method: 'DELETE',
            headers: cabeceras(false),
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar el alumno');
        }

        dialogoEliminar.close();
        await cargarAlumnos();

        mostrarMensaje('Alumno eliminado correctamente');
        idAEliminar = null;
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

/**
 * TODO: helper para mostrar mensajes (error en rojo, éxito en verde).
 */
function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

// Conexión de eventos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btnNuevo').addEventListener('click', abrirDialogoNuevo);

    form.addEventListener('submit', guardarAlumno);

    document.querySelector('#btnCancelar').addEventListener('click', () => {
        dialogoForm.close();
    });

    document.querySelector('#btnCancelarEliminar').addEventListener('click', () => {
        dialogoEliminar.close();
        idAEliminar = null;
    });

    document.querySelector('#btnConfirmarEliminar').addEventListener('click', ejecutarEliminar);

    tabla.addEventListener('click', (event) => {
        const botonEditar = event.target.closest('[data-editar]');
        const botonEliminar = event.target.closest('[data-eliminar]');

        if (botonEditar) {
            abrirDialogoEditar(botonEditar.dataset.editar);
        }

        if (botonEliminar) {
            eliminarAlumno(botonEliminar.dataset.eliminar);
        }
    });

    cargarAlumnos();
});
