const express = require('express');
const router = express.Router();
const Product = require('./../models/product');
const Category = require('./../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// create multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("image is invalid.");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

// middleware setup


// routes

/*
  URL: api/v1/products
  Method: GET
  Desc: get all products
*/
router.get('/', (req, res) => {

  // filter products based on category
  // query params is used
  // base_url/api/v1/products?categories=123,256,652

  let filter = [];

  // if category query params is provided
  if (req.query.categories) {
    // split category id into array
    const temp = req.query.categories.split(',');

    // get only valid mongodb object id from array
    filter = temp.filter(categoryID => mongoose.isValidObjectId(categoryID));
  }

  const mongoFilter = ((filter.length !== 0) ? { category: filter } : {});

  // get all products from database
  Product.find(mongoFilter)
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
router.post('/', uploadOptions.single('image'), (req, res) => {

  // if image file is not provided
  if (!req.file) {
    // error response
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'Product image not provided.'
    });
  }

  // uploaded file name
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

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
        image: `${basePath}${fileName}`,
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
router.put('/:id', uploadOptions.single('image'), (req, res) => {

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
    .then(async category => {
      // check category exists or not
      if (!category) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Product category dont exists.'
        });
      }

      // get product data
      const prod = await Product.find(productID);

      // create imagePath for database
      let imagePath = null;

      // if product exists
      if (prod) {

        // if image file uploaded
        if (req.file) {
          // uploaded file name
          const fileName = req.file.filename;
          const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
          // create image path
          imagePath = `${basePath}${fileName}`
        } else {
          // copy old image path from product database
          imagePath = prod.image;
        }
      }

      // create updated product
      const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
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


/*
  URL: api/v1/products/get/count
  Method: GET
  Desc: Get number of products in database
*/
router.get('/get/count', (req, res) => {

  // get number of products
  Product.countDocuments({})
    .then(count => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Number of products in collection.',
        count: count
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get number of products.',
        error: error
      });
    });
});


/*
  URL: api/v1/products/get/featured
  Method: GET
  Desc: Get all featured product
*/
router.get('/get/featured', (req, res) => {

  // get featured products
  Product.find({ isFeatured: true })
    .then(products => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Featured products list.',
        products: products
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get featured products.',
        error: error
      });
    });
});

/*
  URL: api/v1/products/get/featured/:count
  Method: GET
  Desc: Get featured product by limit
*/
router.get('/get/featured/:count', (req, res) => {
  // get count
  const count = (!isNaN(Number(req.params.count)) ? Number(req.params.count) : 0);

  // get featured products
  Product.find({ isFeatured: true }).limit(count)
    .then(products => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Featured products by count list.',
        products: products
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get featured products by count.',
        error: error
      });
    });
});


/*
  URL: api/v1/products/gallery-images/:id
  Method: PUT
  Desc: Upload image gallery for product
*/
router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {

    // if files are provided
    if (!req.files) {
      // error response
      return res.status(404).json({
        status: false,
        code: 404,
        message: 'Product galley images not provided.',
      });
    }

    // get product id from url
    const productID = req.params.id;

    // check id is valid or not
    if (!mongoose.isValidObjectId(productID)) {
      // error response
      return res.status(422).json({
        status: false,
        code: 422,
        message: 'Product id is not valid.',
      });
    }

    const files = req.files;
    let imagesPath = [];

    if (files) {
      files.forEach(file => {
        // uploaded file name
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        // add file url into imagesPath array
        imagesPath.push(`${basePath}${fileName}`);
      });
    }

    // update product images gallery
    const product = await Product.findByIdAndUpdate(
      productID,
      {
        images: imagesPath
      },
      {
        new: true
      }
    );

    // if product is empty
    if (!product) {
      // error response
      return res.status(404).json({
        status: false,
        code: 404,
        message: 'Product not found in database.'
      });
    }

    // success response
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Product image gallery uploaded.',
      product: product
    });
  });


// export router
module.exports = router;