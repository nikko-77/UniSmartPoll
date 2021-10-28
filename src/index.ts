import express, { query } from 'express';
import session from 'express-session';
import morgan from 'morgan';
/* import http from 'http'; */
import handlers from './handlers/smartpoll';
import comunidades from './controllers/comunidades';
import usuarios from './controllers/usuarios';

const app = express();
/* const server = http.createServer(app); */

declare module 'express-session' {
	interface SessionData {
		id_usuario:string;
		nombre_usuario:string;
		contraseña:string;
		nombres:string;
		apellidos:string;
	}
}

app.set('view engine', 'ejs');
app.set('views', 'public/views');

app.use( express.static('public') );
app.use( morgan('dev') );
app.use( session( {resave:false, secret:"secret", saveUninitialized:false} ) );
app.use( express.json() );
app.use( express.urlencoded({extended:true}) );

handlers.registerHandlers(app);

app.get('/test', async (req,res) => {
	/* let comunidad_creada = await comunidades.crear("juegos", "juegos", 1);
	console.table(comunidad_creada);
	let query_result = await comunidades.eliminar(comunidad_creada.id);
	console.table(query_result); */
	let query_result = await usuarios.obtener(1);
	console.table(query_result);
	res.json(query_result);
});


const port = 3000;

app.listen(port, () => {
	console.log(`Escuchando desde el puerto ${port}.`)
});
