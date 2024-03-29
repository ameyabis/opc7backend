require('dotenv').config();

const bcrypt = require('bcrypt');
const models = require('../models');
const utils = require('../util/jwtUtils')

exports.signup = (req, res, _next) => {
    const email = req.body.email;
    const surname = req.body.surname;
    const firstname = req.body.firstname;
    const password = req.body.password;

    if(email == null || surname == null || firstname == null || password == null) {
        return res.status(400).json({ 'error': 'Manque un/des parametre(s)' });
    }
    models.User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    .then(user => {
        if(!user) {
            bcrypt.hash(password, 10, function (err, bcryptedPassword ) {
                const newUser = models.User.create({
                    email: email,
                    surname: surname,
                    firstname: firstname,
                    password: bcryptedPassword,
                    isAdmin: false
                })
                .then(newUser => { res.status(201).json({ 'id': newUser.id }) })
                .catch(err => { res.status(500).json({ err }) })
            });
        } else {
            return res.status(409).json({ 'error': 'Cette utilisateur existe déjà' });
        }
    })
    .catch(err => { res.status(500).json({ err })   })
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        res.status(400).json({ error: 'Il manque  parametre'})
    }
    models.User.findOne({ where: { email: email } })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (errComparePassword, resComparePassword) => {
                if(resComparePassword) {
                    res.status(200).json({
                        userId: user.id,
                        token: utils.generateToken(user),
                        isAdmin: user.isAdmin
                    });
                } else {
                    res.status(403).json({ error : 'invalid password ' });
                }
            })    
        } else {
            res.status(404).json({ 'erreur' : 'Cet utilisateur n\'éxiste pas' })
        }
    })
    .catch(err => { res.status(500).json({ err }) })
};

exports.getOneLogin = (req, res, _next) => {
    models.User.findByPk(req.params.id)
    .then(login => res.status(200).json(login))
    .catch(error => res.status(400).json({ error }))
};

exports.getLogin = (_req, res, _next) => {
    models.User.findAll()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteLogin = (req, res, _next) => {
    models.User.destroy({ 
        where: { id: req.params.id } 
    })
    .then(() => {
        return res.status(200).json({ message: 'suppression reussite !'})
    })
    .catch(error => res.status(500).json({ error }))
};

exports.updateLogin = (req, res, _next) => {
    bcrypt.hash(req.body.password, 10, function ( err, bcryptedPassword ) {
        models.User.update({
            firstname : req.body.firstname,
            surname : req.body.surname,
            email : req.body.email,
            password : bcryptedPassword
        },
        { where : { id: req.params.id }})
        .then(() => {
            return res.status(201).json({ message: 'Modification reussite ! '})
        })
        .catch(error => res.status(500).json({ error }))
    })
};