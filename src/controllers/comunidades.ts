import connection from "./connection";

class Comunidades {
	async crear(nombre:string, descripcion:string, id_usuario:number) {
		let result = 
			await connection.query("CALL ComunidadesCrear(?,?,?)", [nombre,descripcion,id_usuario]);
		return result[0][0];
	}
	async eliminar(id_comunidad:number) {
		let result = 
			await connection.query("CALL ComunidadesEliminar(?)", [id_comunidad]);
		return result;
	}
	async buscar(valor:string, id_usuario:number) {
		let result = 
			await connection.query("CALL ComunidadesBuscar(?,?)", [valor,id_usuario]);
		return result[0];
	}
	async obtener(id_comunidad:number) {
		let result = 
			await connection.query("CALL ComunidadesObtener(?)", [id_comunidad]);
		return result;
	}
	async obtenerFeed(id_comunidad:number) {
		let result = 
			await connection.query("CALL ComunidadesObtenerFeed(?)", [id_comunidad]);
		return result[0];
	}
	async unirse(id_comunidad:number, id_usuario:number) {
		let result = 
			await connection.query("CALL ComunidadesUnirse(?,?)", [id_comunidad,id_usuario]);
		return result;
	}
	async desunirse(id_comunidad:number, id_usuario:number) {
		let result = 
			await connection.query("CALL ComunidadesDesunirse(?,?)", [id_comunidad,id_usuario]);
		return result;
	}
	async checkUsuarioUnidoComunidad(id_comunidad:number, id_usuario:number) {
		let result = 
			await connection.query("CALL CheckUsuarioUnidoComunidad(?,?)", [id_comunidad,id_usuario]);
		return result[0][0].check_result == 1;
	}
}

const comunidades = new Comunidades();

export default comunidades;
