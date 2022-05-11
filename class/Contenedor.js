
import * as Knex from 'knex'

class Contenedor {

    constructor(options, table) {
        this.db = Knex.default(options)
        this.table = table
    }

    async getAll() {
        try {
            const rows = await this.db(this.table)
            return rows

        } catch (error) {
            console.log(`Error al querer leer el contenido de la tabla ${this.table}.`, error)
            return null
        }
    }

    async save(obj) {
        try {
            const result = await this.db(this.table).insert(obj)
            return result[0]

        } catch (error) {
            console.log(`Pasaron cosas al guardar nuevo objeto en la tabla ${this.table}.`, error);
            return null
        }
    }

    async getById(id) {
        try {
            const rows = await this.db(this.table).where('id', id)
            return rows[0] || null

        } catch (error) {
            console.log(`Error al obtener objeto con id ${id} de la tabla ${this.table}.`, error);
            return null
        }
    }

    async deleteById(id) {
        try {
            return await this.db(this.table).where('id', id).del()
        } catch (error) {
            console.log(`Error al eliminar objeto con id ${id} de la tabla ${this.table}.`, error);
            return null
        }
    }

    async deleteAll() {
        try {
            return await this.db(this.table).del()
        } catch (error) {
            console.log(`Error al eliminar la tabla ${this.table}.`, error);
            return null
        }
    }

    async editById(id, obj) {
        try {
            return await this.db(this.table).where('id', id).update(obj)

        } catch (error) {
            console.log(`Error al editar objeto con id ${id} de la tabla ${this.table}.`, error);
            return null
        }
    }
}

export default Contenedor 