const express = require('express');
const router = express.Router();

// middleware setup


// routes

/*
  URL: api/v1/users
  Method: GET
*/
router.get('/', (req, res) => {
  return res.status(200).json({
    status: true,
    code: 200,
    message: 'API users working.'
  });
});


// export router
module.exports = router;