const jwt = require('jsonwebtoken')

module.exports = {
  tokenSign : process.env.RTOKEN,
  generateToken: function (user) {
    return jwt.sign({
      userId: user.id,
      isAdmin: user.isAdmin,
    },
      this.tokenSign,
      {
        expiresIn: '24h'
      })
  },
  getUserId: function (data) {
    if (data.length > 1) {
      const token = data.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, this.tokenSign)
        userId = decodedToken.userId
        return userId
      }
      catch (err) {
        return err
      }
    };
  }
}