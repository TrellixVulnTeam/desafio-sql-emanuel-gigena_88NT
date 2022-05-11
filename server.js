
import path from 'path'
import newContenedorMensajes from './class/ContenedorMensajes.js'
import newContenedorProductos from './class/ContenedorProductos.js'
import express from 'express'
const app = express();
import { createServer } from "http"
import { Server } from "socket.io"
const httpServer = createServer(app);
const io = new Server(httpServer);

const CHATMSG = 'chat_msg'
const PRODMSG = 'prod_msg'

async function serverMain() {
    try {
        const contenedorProd = await newContenedorProductos()
        const contenedorChat = await newContenedorMensajes()
        const STATICPATH = '/static'
        app.use(STATICPATH, express.static(path.resolve('./public')));
        const mwError = (err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: err });
        }
        app.use(mwError)
        app.get('/', (req, res) => {
            try {
                res.sendFile(path.resolve('./public/index.html'));

            } catch (error) {
                res.status(500).json({ error: error });
            }
        });
        const mensajes = await contenedorChat.getAll()
        const productos = await contenedorProd.getAll()
        io.on('connection', (socket) => {

            console.log('Client connected:', socket.id);
            for (const p of productos) {
                socket.emit(PRODMSG, p)
            }
            for (const m of mensajes) {
                socket.emit(CHATMSG, m)
            }
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
        io.engine.on("connection_error", (err) => {
            console.log(err.req); 
            console.log(err.code);    
            console.log(err.message); 
            console.log(err.context);  
        });
        try {
            const PORT = process.env.PORT || 8080;
            httpServer.listen(PORT, () => console.log(`Socket.IO server running. PORT: ${httpServer.address().port}`));

        } catch (error) {
            httpServer.listen(0, () => console.log(`Socket.IO server running. PORT: ${httpServer.address().port}`));
        }
        httpServer.on("error", error => {
            console.log('Error en el servidor:', error);
        })

    } catch (error) {
        console.log('Error en el hilo principal:', error);
    }
}
serverMain() 