import connection from "./connection";

class Opciones {
	async añadir(id_poll:number, opcion:string) {
		let result = 
			await connection.query("CALL OpcionAñadir(?,?)", [id_poll,opcion]);
		return result[0][0];
	}
	async eliminar(id_opcion:number) {
		let result = 
			await connection.query("CALL OpcionEliminar(?)", [id_opcion]);
		return result;
	}
	async responder(id_opcion:number, id_usuario:number) {
		let result =
			await connection.query("CALL OpcionResponder(?,?)", [id_opcion,id_usuario]);
		return result[0];
	}
}

const opciones = new Opciones();

export default opciones;
