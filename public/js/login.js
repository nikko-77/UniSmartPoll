var txt_nombre_usuario = $("#txt_nombre_usuario");
var txt_contraseña     = $("#txt_contraseña");

async function loguear() {
	let nombre_usuario = txt_nombre_usuario.val();
	let contraseña     = txt_contraseña    .val();
	
	let usuario = await $.post(
		"/login/loguear",
		{nombre_usuario:nombre_usuario,contraseña:contraseña}
	).done();
	
	if ( usuario != null ) {
		window.location.href = "/principal";
	}
}

$('#btn_login').click(loguear);