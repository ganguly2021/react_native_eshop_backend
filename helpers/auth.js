const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const User = require('./../models/user');

// create password hash
const getHashedPassword = (password) => {
  // create salt
  const salt = bcryptjs.genSaltSync(10);

  // create hashed password
  return bcryptjs.hashSync(password, salt);
}

// check password match with hashed password
const isPasswordMatch = (password, hashedPassword) => {
  return bcryptjs.compareSync(password, hashedPassword);
}

// create auth json web token
const getJWTToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

// jwt token validate middleware
const isValidToken = (req, res, next) => {
  const token = req.headers['authorization'];

  // if token not provided
  if (!token) {
    // error response
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'Auth token not found.'
    });
  }

  // decrypt auth token
  jwt.verify(token, secret, (error, payload) => {

    // if error occur
    if (error) {
      // error response
      return res.status(402).json({
        status: false,
        code: 402,
        message: 'Fail to decrypt auth token.'
      });
    }

    // find user in database with payload
    User.findOne({ _id: payload.id })
      .then(user => {
        // if not user
        if (!user) {
          // error response
          return res.status(404).json({
            status: false,
            code: 404,
            message: 'Auth token user not found.'
          });
        }

        // everything ok call next
        next();

      }).catch(error => {
        // error response
        return res.status(502).json({
          status: false,
          code: 502,
          message: 'Database error for auth token user.'
        });
      });
  });
}


module.exports = {
  getHashedPassword,
  isPasswordMatch,
  getJWTToken,
  isValidToken
}