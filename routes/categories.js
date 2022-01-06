const express = require('express');
const router = express.Router();

// middleware setup


// routes

/*
  URL: api/v1/categories
  Method: GET
*/
router.get('/', (req, res) => {
  return res.status(200).json({
    status: true,
    code: 200,
    message: 'API categories working.'
  });
});


// export router
module.exports = router;