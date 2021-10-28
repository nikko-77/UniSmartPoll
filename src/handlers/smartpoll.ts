import { Express, request, RequestHandler } from "express";
import usuarios from "../controllers/usuarios";
import polls from "../controllers/polls";
import comunidades from "../controllers/comunidades";
import opciones from "../controllers/opciones";

function logueado( sessionObj : typeof request.session ) {
	return sessionObj.id_usuario != null;
}

function getDatosUsuario( sessionObj : typeof request.session ) {
	const datos = {
		id_usuario:     sessionObj.id_usuario!,
		nombre_usuario: sessionObj.nombre_usuario!,
		contraseña:     sessionObj.contraseña!,
		nombres:        sessionObj.nombres!,
		apellidos:      sessionObj.apellidos!,
	};
	return datos;
}

function cerrarSesion( sessionObj : typeof request.session, callback : (err:any)=>void ) {
	sessionObj.destroy(callback);
}

class SmartPoll {
	registerHandlers(app:Express) {
		app.get ( '/'                    , this.index );
		app.get ( '/login'               , this.login );
		app.get ( '/registro'            , this.registro );
		app.get ( '/principal'           , this.principal );
		app.get ( '/comunidad'           , this.comunidad );
		app.get ( '/comunidad/crear'     , this.controllerComunidadesCrear );
		app.get ( '/comunidad/unirse'    , this.controllerComunidadesUnirse );
		app.get ( '/comunidad/desunirse' , this.controllerComunidadesDesunirse );
		app.get ( '/crearComunidad'      , this.crearComunidad );
		app.get ( '/buscarComunidades'   , this.buscarComunidades );
		app.get ( '/poll'                , this.poll );
		app.get ( '/responderPoll'       , this.controllerPollsResponder );
		app.get ( '/resultadosPoll'      , this.resultadosPoll );
		app.get ( '/poll/crear'          , this.pollsCrear );
		app.get ( '/poll/crear/crear'    , this.controllerPollsCrear );
		app.get ( '/login/cerrarSesion'  , this.cerrarSesion );
		
		app.post( '/login/loguear'      , this.loguear );
		app.post( '/registro/registrar' , this.registrar );
	}
	
	// INDEX
	
	index:RequestHandler = async (req,res) => {
		res.redirect("/login");
	};
	
	// LOGIN
	
	login:RequestHandler = async (req,res) => {
		if ( !logueado(req.session) ) {
			res.render('login');
		} else {
			res.redirect('/principal');
		}
	};
	
	registro:RequestHandler = async (req,res) => {
		res.render('registro');
	};
	
	cerrarSesion:RequestHandler = async (req,res) => {
		cerrarSesion(req.session, () => {
			res.redirect('/login');
		});
	};
	
	// PRINCIPAL
	
	principal:RequestHandler = async (req,res) => {
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			let feed = await usuarios.obtenerFeed(parseInt(datos_usuario.id_usuario!));
			res.render('principal', {datos_usuario: datos_usuario, feed_usuario:feed, usuario_comunidades:usuario_comunidades, usuario_comunidades_creadas:usuario_comunidades_creadas, usuario_polls:usuario_polls});
		} else {
			res.redirect('/login');
		}
	};
	
	// COMUNIDAD
	
	comunidad:RequestHandler = async (req,res) => {
		const id_comunidad = parseInt(req.query.id! as string);
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0][0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			
			const query_comunidad = await comunidades.obtener(id_comunidad);
			const datos_comunidad = query_comunidad[0][0];
			const comunidad_usuarios = query_comunidad[1];
			const usuario_unido_comunidad = await comunidades.checkUsuarioUnidoComunidad(id_comunidad, parseInt(datos_usuario.id_usuario));
			console.log(usuario_unido_comunidad);
			
			let feed = await comunidades.obtenerFeed(id_comunidad);
			res.render('comunidad', {
				datos_usuario: datos_usuario,
				feed_usuario:feed,
				usuario_comunidades:usuario_comunidades,
				usuario_comunidades_creadas:usuario_comunidades_creadas,
				usuario_polls:usuario_polls,
				datos_comunidad:datos_comunidad,
				comunidad_usuarios:comunidad_usuarios,
				usuario_unido_comunidad:usuario_unido_comunidad
			});
		} else {
			res.redirect('/login');
		}
	};
	
	buscarComunidades:RequestHandler = async (req,res) => {
		let valor:string = "";
		if (req.query.valor != undefined && req.query.valor != null) {
			valor = req.query.valor as string;
		}
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0][0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			
			let resultados_busqueda = await comunidades.buscar(valor, parseInt(datos_usuario.id_usuario));
			res.render('buscarComunidades', {
				datos_usuario: datos_usuario,
				usuario_comunidades:usuario_comunidades,
				usuario_comunidades_creadas:usuario_comunidades_creadas,
				usuario_polls:usuario_polls,
				resultados_busqueda:resultados_busqueda
			});
		} else {
			res.redirect('/login');
		}
	};
	
	crearComunidad:RequestHandler = async (req,res) => {
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0][0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			
			/* let resultados_busqueda = await comunidades.buscar(valor, parseInt(datos_usuario.id_usuario)); */
			res.render('crearComunidad', {
				datos_usuario: datos_usuario,
				usuario_comunidades:usuario_comunidades,
				usuario_comunidades_creadas:usuario_comunidades_creadas,
				usuario_polls:usuario_polls,
				/* resultados_busqueda:resultados_busqueda */
			});
		} else {
			res.redirect('/login');
		}
	};
	
	controllerComunidadesUnirse:RequestHandler = async (req,res) => {
		const id_comunidad = parseInt(req.query.id_comunidad! as string);
		const id_usuario   = parseInt(req.query.id_usuario! as string);
		
		const comunidad = await comunidades.unirse(id_comunidad,id_usuario);
		
		res.redirect(`/comunidad?id=${id_comunidad}`);
		/* res.redirect(`/poll`); */
	};
	
	controllerComunidadesDesunirse:RequestHandler = async (req,res) => {
		const id_comunidad = parseInt(req.query.id_comunidad! as string);
		const id_usuario   = parseInt(req.query.id_usuario! as string);
		
		const comunidad = await comunidades.desunirse(id_comunidad,id_usuario);
		
		res.redirect(`/comunidad?id=${id_comunidad}`);
		/* res.redirect(`/poll`); */
	};
	
	controllerComunidadesCrear:RequestHandler = async (req,res) => {
		const id_usuario  = parseInt(req.query.id_usuario! as string);
		const nombre      = req.query.nombre! as string;
		const descripcion = req.query.descripcion! as string;
		
		const comunidad = await comunidades.crear(nombre,descripcion,id_usuario);
		
		res.redirect(`/comunidad?id=${comunidad.id}`);
		/* res.redirect(`/poll`); */
	};
	
	// POLLS
	
	pollsCrear:RequestHandler = async (req,res) => {
		const id_comunidad = parseInt(req.query.id_comunidad! as string);
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0][0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			
			const query_comunidad = await comunidades.obtener(id_comunidad);
			const datos_comunidad = query_comunidad[0][0];
			const comunidad_usuarios = query_comunidad[1];
			
			let feed = await comunidades.obtenerFeed(id_comunidad);
			res.render('poll/crear', {
				datos_usuario: datos_usuario,
				feed_usuario:feed,
				usuario_comunidades:usuario_comunidades,
				usuario_comunidades_creadas:usuario_comunidades_creadas,
				usuario_polls:usuario_polls,
				datos_comunidad:datos_comunidad,
				comunidad_usuarios:comunidad_usuarios
			});
		} else {
			res.redirect('/login');
		}
	};
	
	controllerPollsCrear:RequestHandler = async (req,res) => {
		const id_usuario = parseInt(req.query.id_usuario! as string);
		const id_comunidad = parseInt(req.query.id_comunidad! as string);
		const titulo = req.query.titulo! as string;
		const respuesta_unica = parseInt(req.query.respuesta_unica! as string) == 1;
		const publico = parseInt(req.query.publico! as string) == 1;
		const opciones = JSON.parse(req.query.opciones! as string);
		
		console.table(id_usuario);
		console.table(id_comunidad);
		console.table(titulo);
		console.table(respuesta_unica);
		console.table(publico);
		console.table(opciones);
		
		const poll = await polls.crear(titulo,respuesta_unica,publico,id_usuario,id_comunidad,opciones);
		
		res.redirect(`/poll?id=${poll.id}`);
		/* res.redirect(`/poll`); */
	};
	
	controllerPollsResponder:RequestHandler = async (req,res) => {
		console.table(req.query.id_usuario! as string);
		console.table(req.query.id_poll!    as string);
		console.table(req.query.id_opcion!  as string);
		
		const id_usuario = parseInt(req.query.id_usuario! as string);
		const id_poll    = parseInt(req.query.id_poll!    as string);
		const id_opcion  = parseInt(req.query.id_opcion!  as string);
		
		console.table(id_usuario);
		console.table(id_poll);
		console.table(id_opcion);
		
		const opcion_respondida = await opciones.responder(id_opcion,id_usuario);
		
		res.redirect(`/resultadosPoll?id=${id_poll}`);
		/* res.redirect(`/poll`); */
	};
	
	poll:RequestHandler = async (req,res) => {
		const id_poll = parseInt(req.query.id! as string);
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0][0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			
			const query_poll = await polls.obtener(id_poll);
			const poll = query_poll[0][0];
			const opciones = query_poll[1];			
			const datos_comunidad = query_poll[3][0];
			const comunidad_usuarios = query_poll[4];
			
			/* res.json(query_poll); */
			
			res.render('poll', {
				datos_usuario: datos_usuario,
				usuario_comunidades:usuario_comunidades,
				usuario_comunidades_creadas:usuario_comunidades_creadas,
				usuario_polls:usuario_polls,
				poll:poll,
				opciones:opciones,
				datos_comunidad:datos_comunidad,
				comunidad_usuarios:comunidad_usuarios
			});
		} else {
			res.redirect('/login');
		}
	};
	
	resultadosPoll:RequestHandler = async (req,res) => {
		const id_poll = parseInt(req.query.id! as string);
		if ( logueado(req.session) ) {
			const datos_usuario = getDatosUsuario(req.session);
			const query_usuario = await usuarios.obtener(parseInt(datos_usuario.id_usuario!));
			const usuario = query_usuario[0][0];
			const usuario_comunidades = query_usuario[1];
			const usuario_comunidades_creadas = query_usuario[2];
			const usuario_polls = query_usuario[3];
			
			const query_poll = await polls.obtener(id_poll);
			const poll = query_poll[0][0];
			const opciones = query_poll[2];
			const datos_comunidad = query_poll[3][0];
			const comunidad_usuarios = query_poll[4];
			
			/* res.json(query_poll); */
			
			res.render('resultadosPoll', {
				datos_usuario: datos_usuario,
				usuario_comunidades:usuario_comunidades,
				usuario_comunidades_creadas:usuario_comunidades_creadas,
				usuario_polls:usuario_polls,
				poll:poll,
				opciones:opciones,
				datos_comunidad:datos_comunidad,
				comunidad_usuarios:comunidad_usuarios
			});
		} else {
			res.redirect('/login');
		}
	};
	
	// FUNCIONES
	
	loguear:RequestHandler = async (req,res) => {
		let nombre_usuario = req.body.nombre_usuario;
		let contraseña     = req.body.contraseña;
		
		let usuario = await usuarios.loguear(nombre_usuario,contraseña);
		
		if (usuario != null) {
			req.session.id_usuario     = usuario.id;
			req.session.nombre_usuario = usuario.nombre_usuario;
			req.session.contraseña     = usuario.contraseña;
			req.session.nombres        = usuario.nombres;
			req.session.apellidos      = usuario.apellidos;
		}
		
		res.json(usuario);
	};
	
	registrar:RequestHandler = async (req,res) => {
		let nombre_usuario = req.body.nombre_usuario;
		let contraseña     = req.body.contraseña;
		let nombres        = req.body.nombres;
		let apellidos      = req.body.apellidos;
		
		let usuario = await usuarios.registrar(nombre_usuario,contraseña,nombres,apellidos);
		
		res.json(usuario);
	};
}

const handlers = new SmartPoll();

export default handlers;