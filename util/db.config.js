/*const Sequelize = require('sequelize');

const sequelize = new Sequelize('groupomania_development', 'root', '67344ef9951a', {
    host: 'localhost',
    dialect: 'mysql'
});

const dbConnection = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connect to database')
    } catch (err) {
        throw new error('Connection failed')
    }
}

module.exports = { sequelize, dbConnection }*/
module.exports={
    HOST: 'localhost',
    USER:'jeremy',
    PASSWORD:'azerty',
    DB:'groupomania_development',
    dialect:"mysql",
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}















// const mysql = require("mysql2");

// const connectdb = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "67344ef9951a",
//     database: 'groupomania_development'
// });
// connectdb.connect(function(err) {
//     if (err) throw err;
//     console.log("Connecté")
// });

// module.exports = connectdb;