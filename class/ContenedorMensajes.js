//Importo Clase Contenedor para luego extender de ella
import Contenedor from './Contenedor.js';

//Importo opciones de conexión
import options from '../options/MySQL.js'

class ContenedorMensajes extends Contenedor {

    constructor() { 
        //Al constructor de la clase Contenedor le paso las opciones de conexión y el nombre de la tabla en cuestión
        super(options, 'mensajes');
    }

    //Dado que los constructores no pueden ser async (porque tienen que devolver el objeto y no una promesa)
    //creo un método de inicialización (Ver: la function de abajo de todo que es la que termino exportando...)
    async init() {
        if (!(await this.db.schema.hasTable(this.table))) {
            //Sólo si no existe la tabla en cuestión la creo con los campos pertinentes.
            await this.db.schema.createTable(this.table, table => {
                table.increments('id').primary();
                table.string('email').notNullable()
                table.timestamp('timeStamp').defaultTo(this.db.fn.now()) //Esto automáticamente almacena le timeStamp del registro.
                table.string('msj').notNullable()
            });
        }
    }

    async saveMensaje(obj) { 
        //La única dif con el save de la clase Contenedor es que valido la estructura del objeto
        if (obj &&
            typeof (obj.email) == 'string' &&
            typeof (obj.msj) == 'string' &&
            Object.keys(obj).length == 2) {

            return await this.save(obj)

        } else {
            console.log(`Estructura del objeto Mensaje INCORRECTA. Se esperaba: { email : string , msj : string }`);
            return null
        }
    }
}

const newContenedorMensajes = async () => {
    const container = new ContenedorMensajes()
    await container.init()
    return container
    //Devuelvo el nuevo objeto pero además inicializado.
}

export default newContenedorMensajes 