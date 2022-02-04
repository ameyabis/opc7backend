const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models')

// const sequelizeDB = require('./util/database');
const path = require('path');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/post');
const likesRoutes = require('./routes/like');

const app = express();

async function main(){
    await sequelize.sync()
}

main();
// sequelizeDB.sync();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/like', likesRoutes);

module.exports = app;