const bcrypt = require('bcrypt');
const jwtUtils = require('../util/jwt.utils');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const surname = req.body.surname;
    const firstname = req.body.firstname;
    const password = req.body.password;

    if(email == null || surname == null || firstname == null || password == null) {
        return res.status(400).json({ 'error': 'Manque un/des parametre(s)' });
    }
    await User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    .then(function(userFound) {
        if(!userFound) {
            bcrypt.hash(password, 10, function (err, bcryptedPassword ) {
                const user = User.create({
                    email: email,
                    surname: surname,
                    firstname: firstname,
                    password: bcryptedPassword,
                    isAdmin: 0
                })
                .then(function(user) {
                    return res.status(201).json({
                        'userId': user.id
                    })
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'Impossible d\'ajouter l\'utilisateur' });
                })
            });
        } else {
            return res.status(409).json({ 'error': 'L\'utilisateur existe déjà' });
        }
    })
    .catch(function(err) {
        return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur' });
    })
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'Manque un/des parametre(s)' });
    }

    await User.findOne({
        where: { email: email }
    })
    .then(function(userFound) {
        if (userFound) {
            bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                if(resBycrypt) {
                    return res.status(200).json({
                        'user': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    });
                } else {
                    return res.status(403).json({ 'error': 'Mot de passe invalide' });
                }
            })
        } else {
            return res.status(404).json({ 'error' : 'L\'utilisateur n\'est pas enregistré' });
        }
    })
    .catch(function(err) {
        return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur' });
    })
};