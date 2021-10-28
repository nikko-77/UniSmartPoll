import connection from "./connection";

class Usuarios {
	async loguear(nombre_usuario:string, contraseña:string) {
		let result = 
			await connection.query("CALL UsuariosLoguear(?,?)", [nombre_usuario,contraseña]);
		let rows = result[0];
		return rows.length > 0 ? rows[0] : null;
	}
	async registrar(nombre_usuario:string, contraseña:string, nombres:string, apellidos:string) {
		let result = 
			await connection.query("CALL UsuariosRegistrar(?,?,?,?)", [nombre_usuario,contraseña,nombres,apellidos]);
		let rows = result[0];
		return rows.length > 0 ? rows[0] : null;
	}
	async obtener(id:number) {
		let result = 
			await connection.query("CALL UsuariosObtener(?)", [id]);
		/* let rows = result[0];
		return rows.length > 0 ? rows[0] : null; */
		return result.splice(0,4);
	}
	async obtenerFeed(id:number) {
		let result = 
			await connection.query("CALL UsuariosObtenerFeed(?)", [id]);
		let rows = result[0];
		return rows;
	}
}

const usuarios = new Usuarios();

export default usuarios;
