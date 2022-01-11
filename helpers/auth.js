const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const User = require('./../models/user');
const expressJWT = require('express-jwt');
const api_version = process.env.API_VERSION;

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

// revoked token
const isRevoked = (req, payload, done) => {
  // if user is not admin
  // if (!payload.isAdmin){
  //   done(null, true);
  // }

  // everything ok
  done();
}

// decrypt json web token
// using express-jwt
const decryptJWT = () => {
  return expressJWT({
    secret: secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      //{ url: `${api_version}/products`, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api_version}/users/login`,
      `${api_version}/users/register`
    ]
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

      }).catch(error => {
        // error response
        return res.status(502).json({
          status: false,
          code: 502,
          message: 'Database error for auth token user.'
        });
      });
  }

  // everything ok call next
  next();
}

// handle JWT decrypt error
const handleJWTError = (error, req, res, next) => {
  // if error occur during
  // jwt decryption
  if (error) {
    if (error.name === 'UnauthorizedError') {
      // error response
      return res.status(error.status).json({
        status: false,
        code: error.status,
        message: error.message,
        type: error.name
      });
    }
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