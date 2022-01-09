const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const User = require('./../models/user');
const expressJWT = require('express-jwt');

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


// decrypt json web token
// using express-jwt
const decryptJWT = () => {
  return expressJWT({
    secret: secret,
    algorithms: ['HS256']
  });
}

// check user exists in database or 
// not based on token decrypted payload
const validateJWTUser = (req, res, next) => {
  // if user exists in request object
  if (req.user !== undefined) {

    const payload = req.user;

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
  }
}

// handle JWT decrypt error
const handleJWTError = (error, req, res, next) => {
  // if error occur during
  // jwt decryption
  if (error) {
    // error response
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'JWT Decryption error.',
      error: error
    });
  }

  // next middleware
  next();
}

module.exports = {
  getHashedPassword,
  isPasswordMatch,
  getJWTToken,
  decryptJWT,
  validateJWTUser,
  handleJWTError
}