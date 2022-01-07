const express = require('express');
const router = express.Router();
const Product = require('./../models/product');
const Category = require('./../models/category');
const mongoose = require('mongoose');

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
    .populate('category')
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
        message: 'Database error to get all products.',
        error: error
      });
    });
});


/*
  URL: api/v1/products/:id
  Method: GET
  Desc: get product based on id
*/
router.get('/:id', (req, res) => {
  // get product id from URL
  const productID = req.params.id;

  // if product is invalid
  if (!mongoose.isValidObjectId(productID)) {
    // error response
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'Product id not valid.'
    });
  }

  // get product based on id from database
  Product.findById(productID)
    .populate('category')
    .then(product => {

      // if product not found
      if (!product) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Product not found.'
        });
      }

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Product data retreived',
        product: product
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error get product by id.',
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

  // check product category exists or not
  Category.findById(req.body.category)
    .then(category => {
      // check category exists or not
      if (!category) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Product category dont exists.'
        });
      }

      // create new product
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
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
            message: 'Database error to add new product.',
            error: error
          });
        });

    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to find product category.',
        error: error
      });
    });
});


/*
  URL: api/v1/products/:id
  Method: PUT
  Desc: Update product by id.
*/
router.put('/:id', (req, res) => {

  // get product id from url
  const productID = req.params.id;

  // if product is invalid
  if (!mongoose.isValidObjectId(productID)) {
    // error response
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'Product id not valid.'
    });
  }

  // check product category exists or not
  Category.findById(req.body.category)
    .then(category => {
      // check category exists or not
      if (!category) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Product category dont exists.'
        });
      }

      // create updated product
      const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
      };

      // update product
      Product.findByIdAndUpdate(productID, updatedProduct, { new: true })
        .then(product => {

          // if product not found
          if (!product) {
            // error response
            return res.status(404).json({
              status: false,
              code: 404,
              message: 'Product not found.'
            });
          }

          // success response
          return res.status(200).json({
            status: true,
            code: 200,
            message: 'Product updated successfully.',
            product: product
          });
        }).catch(error => {
          // error response
          return res.status(502).json({
            status: false,
            code: 502,
            message: 'Database error to update product',
            error: error
          });
        });

    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to find category.',
        error: error
      });
    });
});


/*
  URL: api/v1/products/:id
  Method: DELETE
  Desc: Delete product by id.
*/
router.delete('/:id', (req, res) => {

  // get product id from url
  const productID = req.params.id;

  // if product is invalid
  if (!mongoose.isValidObjectId(productID)) {
    // error response
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'Product id not valid.'
    });
  }

  Product.findByIdAndDelete(productID)
    .then(product => {

      if (!product) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Product not found.'
        });
      }

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Product deleted.',
        product: product
      });

    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to delete product by id.',
        error: error
      });
    });
});




// export router
module.exports = router;