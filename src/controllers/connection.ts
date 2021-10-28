import mysql from 'mysql';
import util from 'util';

class Connection {
	get() {
		return mysql.createConnection( {
			host: "localhost",
			user: "nikko77",
			password: "alberto",
			database: "smartpoll",
		} );
	}
	
	async query(query:string,values?:any) {
		let cn = this.get();
		cn.on('enqueue', function(sequence) {
			// if (sequence instanceof mysql.Sequence.Query) {
			if ('Query' === sequence.constructor.name) {
			 	console.log(sequence.sql);
			}
		});
		let promise = new Promise<any>( (resolve,reject) => {
			cn.query(query, values, (err,results,fields) => {
				cn.end();
				resolve(results);
			});
		} );
		return promise;
		/* return util.promisify( cn.query ).call<typeof cn, any, any>(cn, query, values); */
	}
};

let connection = new Connection();
export default connection;