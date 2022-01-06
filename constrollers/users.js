const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, _next) => {
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
                .catch(function() {
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

exports.getOneLogin = (req, res, _next) => {
    User.findByPk(req.params.id)
    .then(login => res.status(200).json(login))
    .catch(error => res.status(400).json({ error }))
};

exports.getLogin = (_req, res, _next) => {
    User.findAll()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error }));
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ where: { email: email } })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                id: user.id,
                token: jwt.sign(
                    { id: user.id },
                    process.env.RTOKEN,
                    { expiresIn: '24h' },
                )
            });
        })
        .catch(error => res.status(500).json({ error }));     
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteLogin = (req, res, _next) => {
    User.destroy({ 
        where: { id: req.params.id } 
    })
    .then(() => {
        return res.status(200).json({ message: 'suppression reussite !'})
    })
    .catch(error => res.status(500).json({ error }))
};

exports.updateLogin = (req, res, _next) => {
    bcrypt.hash(req.body.password, 10, function ( err, bcryptedPassword ) {
        User.update({
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