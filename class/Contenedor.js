//Importo knex
import * as Knex from 'knex'

class Contenedor {

    constructor(options, table) {
        this.db = Knex.default(options) //Instancio mi DB según los parámetros de conexión pertinentes
        this.table = table
    }

    async getAll() { //return Object[] - Devuelve un array con los objetos presentes en el archivo.
        try {
            const rows = await this.db(this.table)
            return rows

        } catch (error) {
            console.log(`Error al querer leer el contenido de la tabla ${this.table}.`, error)
            return null
        }
    }

    async save(obj) { //return Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            const result = await this.db(this.table).insert(obj)
            return result[0]

        } catch (error) {
            console.log(`Pasaron cosas al guardar nuevo objeto en la tabla ${this.table}.`, error);
            return null
        }
    }

    async getById(id) { //return Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const rows = await this.db(this.table).where('id', id)
            return rows[0] || null

        } catch (error) {
            console.log(`Error al obtener objeto con id ${id} de la tabla ${this.table}.`, error);
            return null
        }
    }

    async deleteById(id) { //: void - Elimina del archivo el objeto con el id buscado.
        try {
            return await this.db(this.table).where('id', id).del()
            //Esto devuelve la qty de registros eliminados

        } catch (error) {
            console.log(`Error al eliminar objeto con id ${id} de la tabla ${this.table}.`, error);
            return null
        }
    }

    async deleteAll() { //: void - Elimina todos los objetos presentes en el archivo.
        try {
            return await this.db(this.table).del()
            //Esto devuelve la qty de registros eliminados

        } catch (error) {
            console.log(`Error al eliminar la tabla ${this.table}.`, error);
            return null
        }
    }

    async editById(id, obj) {
        try {
            return await this.db(this.table).where('id', id).update(obj)
            //Esto devuelve qty registros editados

        } catch (error) {
            console.log(`Error al editar objeto con id ${id} de la tabla ${this.table}.`, error);
            return null
        }
    }
}

export default Contenedor 