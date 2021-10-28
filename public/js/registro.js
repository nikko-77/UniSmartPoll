var txt_nombre_usuario = $("#txt_nombre_usuario");
var txt_contraseña     = $("#txt_contraseña");
var txt_nombres        = $("#txt_nombres");
var txt_apellidos      = $("#txt_apellidos");

function validar() {
	for ( const arg of arguments ) {
		if ( arg.trim() == "" ) {
			return false;
		}
	}
	return true;
}

async function registrar() {
	var nombre_usuario = txt_nombre_usuario.val();
	var contraseña     = txt_contraseña.val();
	var nombres        = txt_nombres.val();
	var apellidos      = txt_apellidos.val();
	
	if (!validar(nombre_usuario,contraseña,nombres,apellidos)) {
		alert("Por favor, rellene todos los campos.");
		return;
	}
	
	let usuario_registrado = 
		await $.post(
			"/registro/registrar",
			{
				nombre_usuario:nombre_usuario,
				contraseña:contraseña,
				nombres:nombres,
				apellidos:apellidos
			}
		).done();
	
	/* alert(JSON.stringify(usuario_registrado)); */
	if ( usuario_registrado != null ) {
		/* alert("Usuario registrado con exito."); */
		window.location.href = "/login";
	}
}

$("#btn_registrar").click(registrar);