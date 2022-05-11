import Contenedor from './Contenedor.js';
import options from '../options/SQLite3.js'
class ContenedorProductos extends Contenedor {

    constructor() {
        super(options, 'productos');
    }
    async init() {
        if (!(await this.db.schema.hasTable(this.table))) {

            await this.db.schema.createTable(this.table, table => {
                table.increments('id').primary();
                table.string('title').notNullable().unique()
                table.float('price').notNullable()
                table.string('thumbnail').notNullable()
            });
        }
    }

    async saveProducto(obj) { 

        if (obj &&
            typeof (obj.title) == 'string' &&
            typeof (obj.price) == 'number' &&
            typeof (obj.thumbnail) == 'string' &&
            Object.keys(obj).length == 3) {

            return await this.save(obj)

        } else {
            console.log(`SE ESCRIBIERON MAL LA ESTRUCTURA DE LOS DATOS. Se esperaba: { TITLE : string , PRECIO : number , THUMBNAIL : string }`);
            return null
        }
    }
}

const newContenedorProductos = async () => {
    const container = new ContenedorProductos()
    await container.init()
    return container
}

export default newContenedorProductos 