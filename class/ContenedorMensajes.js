import Contenedor from './Contenedor.js';
import options from '../options/MySQL.js'

class ContenedorMensajes extends Contenedor {

    constructor() { 
        super(options, 'mensajes');
    }
    async init() {
        if (!(await this.db.schema.hasTable(this.table))) {
            await this.db.schema.createTable(this.table, table => {
                table.increments('id').primary();
                table.string('email').notNullable()
                table.timestamp('timeStamp').defaultTo(this.db.fn.now()) 
                table.string('msj').notNullable()
            });
        }
    }

    async saveMensaje(obj) { 
        if (obj &&
            typeof (obj.email) == 'string' &&
            typeof (obj.msj) == 'string' &&
            Object.keys(obj).length == 2) {

            return await this.save(obj)

        } else {
            console.log(`SE ESCRIBIERON MAL LA ESTRUCTURA DE LOS DATOS. Se esperaba: { EMAIL : string , MSJ : string }`);
            return null
        }
    }
}

const newContenedorMensajes = async () => {
    const container = new ContenedorMensajes()
    await container.init()
    return container
}

export default newContenedorMensajes 