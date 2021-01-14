var mysql = require('mysql2/promise');

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected'){
        return global.connection;
    }

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'Welcome1234',
        database: 'crud'
    });
    console.log('Conectou no MySQL!');
    global.connection = connection;
    return global.connection;
}
// connect();

async function selectClientes(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM clientes;');
    return rows;
}

async function selectCliente(id){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM clientes WHERE id=?', [id]);
    return rows && rows.length > 0 ? rows[0]:{};    // This means if the rows exist (rows) and (&&) number of rows are more than 0 (rows.length > 0) then (?) return the first row(rows[0]), otherwise (:) return {}
}

async function insertCliente(cliente){
    const conn = await connect();
    const sql = "INSERT INTO clientes(nome, idade, uf) VALUES (?,?,?);";
    return await conn.query(sql, [cliente.nome, cliente.idade, cliente.uf]);
}

async function updateCliente(id, cliente, callback){
    let sql = "UPDATE clientes SET";
    const props = Object.entries(cliente);

    for(var i=0; i < props.length;i++){ 
        const item = props[i];
        if (i!==props.length - 1) { // not the last property
            sql += ` ${item[0]}=?,`;
        }
        else{
            sql += ` ${item[0]}=? WHERE id=?;`;
        }
    }
    const values = props.map(p => p[1]);
    values.push(id);

    const conn = await connect();
    
    return await conn.query(sql, values);
}

async function deleteCliente(id){
    const conn = await connect();
    return await conn.query("DELETE FROM clientes WHERE id=?;", [id]);
}

module.exports = {selectClientes, selectCliente, insertCliente, updateCliente, deleteCliente}