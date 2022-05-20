const jwt = require('jsonwebtoken');

const accessTokenSecret = 'youraccesstokensecret';

const verify = function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("____________");
  console.log(authHeader);

  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log(user)
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


module.exports = verify ; 