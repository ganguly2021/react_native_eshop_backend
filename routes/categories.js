const express = require('express');
const router = express.Router();
const Category = require('./../models/category');

// middleware setup


// routes

/*
  URL: api/v1/categories
  Method: GET
  Desc: get all the categories
*/
router.get('/', (req, res) => {
  // get all categories
  Category.find()
    .then(categories => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'All categories list retrieved.',
        categories: categories
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Fail to get all categories.',
        error: error
      });
    })
});

/*
  URL: api/v1/categories/:id
  Method: GET
  Desc: get category by id
*/
router.get('/:id', (req, res) => {
  // category id from url
  const categoryID = req.params.id;

  // get category by id
  Category.findById(categoryID)
    .then(category => {

      // if category not found
      if (!category) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Category not found.'
        });
      }

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Catergory data retrieved.',
        category: category
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Fail to get category by id.',
        error: error
      });
    })
});

/*
  URL: api/v1/categories
  Method: POST
  Desc: Add new category
*/
router.post('/', (req, res) => {
  // create new category
  const newCategory = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  });

  // save category
  newCategory.save()
    .then(category => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Category added into database.',
        category: category
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Category add failed.',
        error: error
      });
    });
});


/*
  URL: api/v1/categories/:id
  Method: DELETE
  Desc: Delete category using id
*/
router.delete('/:id', (req, res) => {
  // get category id
  const categoryID = req.params.id;

  // find category in database & delete
  Category.findByIdAndRemove(categoryID)
    .then(category => {

      // if category not found
      if (!category) {
        // error response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Category not found.'
        });
      }

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Category deleted.',
        category: category
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Category delete failed.',
        error: error
      });
    });
});


// export router
module.exports = router;