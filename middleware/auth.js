const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.RTOKEN, (err, user) => {
            if (err) {
                return res.status(403);
            }
            next();
        });
    }
    else {
        res.status(401).json({error:"accès non authorisé"});
    }
};