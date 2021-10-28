import connection from "./connection";
import opciones from "./opciones";

class Polls {
	async crear(titulo:string, respuesta_unica:boolean, publico:boolean, id_usuario:number, id_comunidad:number, p_opciones:Array<string>) {
		let result = 
			await connection.query("CALL PollsCrear(?,?,?,?,?)", [titulo,respuesta_unica,publico,id_usuario,id_comunidad]);
		const poll = result[0][0];
		for ( const opcion of p_opciones ) {
			await opciones.añadir(poll.id, opcion);
		}
		return result[0][0];
	}
	async eliminar(id_poll:number) {
		let result = 
			await connection.query("CALL PollsEliminar(?)", [id_poll]);
		return result;
	}
	async buscar(valor:number) {
		let result =
			await connection.query("CALL PollsBuscar(?)", [valor]);
		return result[0];
	}
	async obtener(id_poll:number) {
		let result =
			await connection.query("CALL PollsObtener(?)", [id_poll]);
		return result;
	}
}

const polls = new Polls();

export default polls;
