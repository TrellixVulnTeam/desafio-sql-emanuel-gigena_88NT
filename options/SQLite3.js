const { pathname: root } = new URL('../DB/ecommerce.sqlite', import.meta.url) 

const mysqlOptions = {
    client: 'sqlite3',
    connection: {
        filename: root
    },
    useNullAsDefault: true
}
export default mysqlOptions 