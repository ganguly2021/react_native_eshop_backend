// env file
require('dotenv/config');

const express = require('express');
const app = express();
const database = require('./database');
const port = process.env.PORT
const cors = require('cors');
const morgan = require('morgan');


// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
  return res.status(200).json({
    status: true,
    code: 200,
    message: 'API server working.'
  })
});



// start server
app.listen(port, () => {
  console.log(`Server running at port : ${port}`);
  console.log(`URL: http://localhost:${port}`);
});