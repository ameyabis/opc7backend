const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RTOKEN);
        const userId = decodedToken.idUSERS;
        console.log(decodedToken)
        if (req.body.idUSERS && req.body.idUSERS !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
            res.status(401).json({ error: error | 'Requête non authentifié !'});
    }
};