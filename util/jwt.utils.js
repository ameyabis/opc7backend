const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SIGN_SECRET = process.env.RTOKEN;

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    }
}