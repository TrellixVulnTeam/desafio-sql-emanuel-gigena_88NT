//Importo path que me sirve para jugar con rutas absolutas / relativas
import path from 'path'

//Importo clases Contenedoras (lógica custom en cada clase)
//uno para mensajes de chat con opciones de conexión MySQL
//y otro para productos con opciones de conexión SQLite3
import newContenedorMensajes from './class/ContenedorMensajes.js'
import newContenedorProductos from './class/ContenedorProductos.js'

//Importo y configuro Express y Socket.io (y el server http)
import express from 'express'
const app = express();
import { createServer } from "http"
import { Server } from "socket.io"
const httpServer = createServer(app);
const io = new Server(httpServer);

//Constantes que seteo tanto del lado del server como del cliente ya que deben coincidir.
//Quizás convenga hacerlas variables de entorno (en un .env)
const CHATMSG = 'chat_msg'
const PRODMSG = 'prod_msg'

async function serverMain() {
    try {
        //Instancio contenedores
        //Las async functions newContenedor* emulan un constructor de clase. 
        //Ver: comentarios en los files ContenedorProductos.js / ContenedorMensajes.js
        const contenedorProd = await newContenedorProductos()
        const contenedorChat = await newContenedorMensajes()
        //Las options de la BD y la tabla las parametrizo en la declaración de cada clase extendida
        //podría hacer eso mismo acá en server.js también...

        //Seteo Static
        const STATICPATH = '/static'
        app.use(STATICPATH, express.static(path.resolve('./public')));

        //Configuro Middleware de manejo de errores
        const mwError = (err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: err });
        }
        app.use(mwError)

        //Renderizo mi index.html en la ruta base de mi app
        app.get('/', (req, res) => {
            try {
                res.sendFile(path.resolve('./public/index.html'));

            } catch (error) {
                res.status(500).json({ error: error });
            }
        });

        //Instancio array de productos y mensajes de chat según lo que haya en cada BD
        const mensajes = await contenedorChat.getAll()
        const productos = await contenedorProd.getAll()

        //Gestiono conexión de un cliente
        io.on('connection', (socket) => {

            console.log('Client connected:', socket.id);

            //Envío al nuevo socket los productos y mensajes de chat registrados al momento (en este caso uno por uno)
            for (const p of productos) {
                socket.emit(PRODMSG, p)
            }
            for (const m of mensajes) {
                socket.emit(CHATMSG, m)
            }

            //Recibo, guardo y retransmito Productos
            socket.on(PRODMSG, async (data) => {
                try {
                    let newId = await contenedorProd.saveProducto(data)
                    if (newId) {
                        const prod = await contenedorProd.getById(newId)
                        productos.push(prod)
                        io.sockets.emit(PRODMSG, prod);
                    } else {
                        throw 'Error al guardar nuevo producto'
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            //Recibo, guardo y retransmito Mensajes de Chat
            socket.on(CHATMSG, async (data) => {
                try {
                    let newId = await contenedorChat.saveMensaje(data)
                    if (newId) {
                        const mensaje = await contenedorChat.getById(newId)
                        mensajes.push(mensaje)
                        io.sockets.emit(CHATMSG, mensaje);
                    } else {
                        throw 'Error al guardar nuevo Mensaje de Chat'
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on('disconnect', () => console.log('Disconnected!', socket.id));
        });

        //Socket.io Error logging
        io.engine.on("connection_error", (err) => {
            console.log(err.req);      // the request object
            console.log(err.code);     // the error code, for example 1
            console.log(err.message);  // the error message, for example "Session ID unknown"
            console.log(err.context);  // some additional error context
        });

        //Pongo a escuchar al server
        try {
            const PORT = process.env.PORT || 8080;
            httpServer.listen(PORT, () => console.log(`Socket.IO server running. PORT: ${httpServer.address().port}`));

        } catch (error) {
            //Si falla el listen al puerto estipulado pruebo que se me asigne automáticamente otro puerto libre...
            httpServer.listen(0, () => console.log(`Socket.IO server running. PORT: ${httpServer.address().port}`));
        }

        //Server Error handling
        httpServer.on("error", error => {
            console.log('Error en el servidor:', error);
        })

    } catch (error) {
        console.log('Error en el hilo principal:', error);
    }
}
serverMain() 