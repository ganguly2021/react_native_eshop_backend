// env file
require('dotenv/config');

const express = require('express');
const app = express();
const database = require('./database');
const port = process.env.PORT
const cors = require('cors');
const morgan = require('morgan');

const {
  decryptJWT,
  validateJWTUser,
  handleJWTError
} = require('./helpers/auth');

// api routes
const api_version = process.env.API_VERSION;
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');


// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app.use(morgan('dev'));

// handle JSON web Token
app.use(decryptJWT());
app.use(handleJWTError);
app.use(validateJWTUser);

// products api routes
app.use(`${api_version}/products`, productRoutes);

// users api routes
app.use(`${api_version}/users`, userRoutes);

// orders api routes
app.use(`${api_version}/orders`, orderRoutes);

// categories api routes
app.use(`${api_version}/categories`, categoriesRoutes);

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