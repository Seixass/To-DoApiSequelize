import { Sequelize } from "sequelize";

const conn = new Sequelize("ToDoProject", "root", "Sen@iDev77!.", {
    host: "localhost",
    dialect: "mysql",
});

try{
    await conn.authenticate();
    console.log('Connection MYSQL')
} catch(error){
    console.error('Error:', error)
}

export default conn;