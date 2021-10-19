const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./util/db.config')
const Sequelize = require('sequelize');
const userRoutes = require('./routes/users');

const sequelize = new Sequelize(dbConfig.DB,'jeremy',dbConfig.PASSWORD,{
    dialect:dbConfig.dialect,
})

const db = {};
db.Sequelize= Sequelize;
db.sequelize = sequelize
const app = express();

db.sequelize.sync();

app.get('/', ((req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon serveur</h1>');
}));

//BDD Connection
/*const { dbConnection } = require('./util/database');
dbConnection();*/

/*const sequelize = new Sequelize('groupomania_development', 'root', '67344ef9951a', {
    host: 'localhost',
    dialect: 'mysql'
});

    try {
        await sequelize.authenticate()
        console.log('Connect to database')
    } catch (err) {
        throw new error('Connection failed')
    }*/



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log('Requete recu !');
//     next();
// });

app.use('/api/auth', userRoutes);

module.exports = app;