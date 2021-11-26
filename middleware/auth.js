const jwt = require('jsonwebtoken');
const jwtUtils = require('../util/jwt.utils');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtUtils.generateTokenForUser);
        const userId = decodedToken.idUSERS;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
            res.status(401).json({ error: error | 'Requête non authentifié !'});
    }
};