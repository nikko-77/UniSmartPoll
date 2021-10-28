const btn_añadir_opcion = $("#btn_añadir_opcion");
const btn_crear_poll    = $("#btn_crear_poll");

function crearPoll() {
	const titulo           =  document.getElementById("txt_titulo")         .value.trim();
	const opciones         =  obtenerOpciones();
	const respuesta_unica  =  document.getElementById("chk_respuesta_unica").checked ? 1 : 0;
	const publico          =  document.getElementById("chk_publico")        .checked ? 1 : 0;
	
	if ( titulo == "" ) {
		alert("Título no encontrado. ¿Ha rellenado todos los campos?");
		return;
	}
	if (opciones == null) {
		alert("Opciones faltantes. ¿Ha rellenado todos los campos?");
		return;
	}
	
	console.log ( titulo );
	console.log ( opciones );
	console.log ( respuesta_unica );
	console.log ( publico );
	
	window.location.href = `/poll/crear/crear?id_usuario=${id_usuario}&id_comunidad=${id_comunidad}&titulo=${titulo}&opciones=${JSON.stringify(opciones)}&respuesta_unica=${respuesta_unica}&publico=${publico}`;
}

function añadirOpcion() {
	const table = document.getElementById("tabla_opciones");
	const n_rows = table.rows.length;
	const opcionHTML = `<td><input type="text" placeholder="Opcion"></td><td><button style="padding:0.5rem" onclick="eliminarOpcion( this.parentNode.parentNode )">X</button></td>`;
	const row = table.insertRow(n_rows);
	row.innerHTML = opcionHTML;
}

function eliminarOpcion(row) {
	const table = document.getElementById("tabla_opciones");
	if ( table.rows.length > 2 ) {
		const table_body = row.parentNode;
		table_body.removeChild(row);
	}
	/* table.removeChild(row);
	alert(row.innerHTML); */
}

function obtenerOpciones() {
	const table_inputs = $("#tabla_opciones input");
	const opciones = [];
	let invalido = false;
	table_inputs.each( (index,elem) => {
		const opcion = $(elem).val();
		if ( opcion.trim() == "" ) {
			invalido = true;
		}
		opciones.push($(elem).val());
	} );
	return invalido ? null : opciones;
}

btn_añadir_opcion.click( añadirOpcion );
btn_crear_poll   .click( crearPoll );

const opciones_iniciales = 3;
for ( let i = 1; i <= opciones_iniciales; i++ ) {
	añadirOpcion();
}

// Exports

window.eliminarOpcion = eliminarOpcion;
