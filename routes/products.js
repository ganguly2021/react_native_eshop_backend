const express = require('express');
const router = express.Router();
const Product = require('./../models/product');

// middleware setup


// routes

/*
  URL: api/v1/products
  Method: GET
  Desc: get all products
*/
router.get('/', (req, res) => {
  // get all products from database
  Product.find()
    .then(products => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'All products data.',
        products: products
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Fail to get all products.',
        error: error
      });
    });
});

/*
  URL: api/v1/products
  Method: POST
  Desc: Add new product.
*/
router.post('/', (req, res) => {

  // create new product
  const newProduct = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock
  });

  // save product
  newProduct.save()
    .then(product => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Product added to database.',
        product: product
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Fail to add product.',
        error: error
      });
    });
});



// export router
module.exports = router;