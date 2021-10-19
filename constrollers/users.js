const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const surname = req.body.surname;
    const firstname = req.body.firstname;
    const password = req.body.password;

    if(email == null || surname == null || firstname == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
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
                .then(function(newUser) {
                    return res.status(201).json({
                        'userId': user.id
                    })
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannor add user' });
                })
            });
        } else {
            return res.status(409).json({ 'error': 'user already exist' });
        }
    })
    .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};

exports.login = (req, res, next) => {

};