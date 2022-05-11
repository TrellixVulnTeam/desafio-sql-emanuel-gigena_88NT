import Contenedor from './Contenedor.js';

//Importo opciones de conexión
import options from '../options/SQLite3.js'

class ContenedorProductos extends Contenedor {

    constructor() {
        //Al constructor de la clase Contenedor le paso las opciones de conexión y el nombre de la tabla en cuestión
        super(options, 'productos');
    }

    //Dado que los constructores no pueden ser async (porque tienen que devolver el objeto y no una promesa)
    //creo un método de inicialización (Ver: la function de abajo de todo que es la que termino exportando...)
    async init() {
        if (!(await this.db.schema.hasTable(this.table))) {
            //Sólo si no existe la tabla en cuestión la creo con los campos pertinentes.
            await this.db.schema.createTable(this.table, table => {
                table.increments('id').primary();
                table.string('title').notNullable().unique()
                table.float('price').notNullable()
                table.string('thumbnail').notNullable()
            });
        }
    }

    async saveProducto(obj) { 
        //La única dif con el save de la clase Contenedor es que valido la estructura del objeto
        if (obj &&
            typeof (obj.title) == 'string' &&
            typeof (obj.price) == 'number' &&
            typeof (obj.thumbnail) == 'string' &&
            Object.keys(obj).length == 3) {

            return await this.save(obj)

        } else {
            console.log(`Estructura del objeto Producto INCORRECTA. Se esperaba: { title : string , price : number , thumbnail : string }`);
            return null
        }
    }
}

const newContenedorProductos = async () => {
    const container = new ContenedorProductos()
    await container.init()
    return container
    //Devuelvo el nuevo objeto pero además inicializado.
}

export default newContenedorProductos 