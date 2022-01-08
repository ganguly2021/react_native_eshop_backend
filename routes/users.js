const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('./../models/user');
const {
  getHashedPassword,
  isPasswordMatch,
  getJWTToken
} = require('./../helpers/auth')

// middleware setup


// routes

/*
  URL: api/v1/users
  Method: GET
  Desc: get all users
*/
router.get('/', (req, res) => {

  // get all user from mongodb
  User.find().select('-password -dateCreated')
    .then(users => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'All users list',
        users: users
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get all users.',
        error: error
      });
    });
});

/*
  URL: api/v1/users/:id
  Method: GET
  Desc: get user by id
*/
router.get('/:id', (req, res) => {

  const userID = req.params.id;

  // if user is not valid
  if (!mongoose.isValidObjectId(userID)) {
    // error response
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'User id is not valid'
    });
  }

  User.findOne({ _id: userID }).select('-password -dateCreated')
    .then(user => {
      // if user not exists
      if (!user) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'User not found.'
        });
      }

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Get user by id.',
        user: user
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get user by id.',
        error: error
      });
    });
});


/*
  URL: api/v1/users
  Method: POST
  Desc: Signup new user.
*/
router.post('/', (req, res) => {

  // check email already exists
  User.findOne({ email: req.body.email })
    .then(user => {
      // if user exists
      if (user) {
        // error response
        return res.status(409).json({
          status: false,
          code: 409,
          message: 'User already exists.'
        });
      }

      // create new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: getHashedPassword(req.body.password)
      });

      // save new user
      newUser.save()
        .then(user => {
          // success response
          return res.status(200).json({
            status: true,
            code: 200,
            message: 'New user signed up.',
            user: user
          });
        }).catch(error => {
          // error response
          return res.status(502).json({
            status: false,
            code: 502,
            message: 'Database error for create new user.',
            error: error
          });
        });

    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error for signup new user.',
        error: error
      });
    });
});


/*
  URL: api/v1/users/login
  Method: POST
  Desc: Login user
*/
router.post('/login', (req, res) => {

  // check user exists or not
  User.findOne({ email: req.body.email })
    .then(user => {
      // if user not exists
      if (!user) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'User not found.'
        });
      }

      // if password not match
      if (!isPasswordMatch(req.body.password, user.password)) {
        // error response
        return res.status(401).json({
          status: false,
          code: 401,
          message: 'Password not matched.'
        });
      }

      // create jwt payload
      const payload = {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
        email: user.email
      };

      // create jwt token
      const token = getJWTToken(payload);

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'User login success.',
        token: token,
        user: payload
      });

    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error for login user.',
        error: error
      });
    });
});


/*
  URL: api/v1/users/get/count
  Method: GET
  Desc: Get number of users in database
*/
router.get('/get/count', (req, res) => {

  // get number of users
  User.countDocuments({})
    .then(count => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Number of users in collection.',
        count: count
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get number of users.',
        error: error
      });
    });
});



// export router
module.exports = router;