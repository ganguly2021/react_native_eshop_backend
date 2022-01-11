const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./../models/order');
const OrderItem = require('./../models/order-item');

// middleware setup


// routes

/*
  URL: api/v1/orders
  Method: GET
  Desc: get all orders
*/
router.get('/', (req, res) => {

  // read all order from orders collections
  Order.find()
    .populate('user', 'name email')
    .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    .sort({ 'dateOrdered': -1 })
    .then(orders => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'All order list.',
        orders: orders
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get all the orders.',
        error: error
      });
    });

});


/*
  URL: api/v1/orders/:id
  Method: GET
  Desc: get order by id
*/
router.get('/:id', (req, res) => {

  const orderID = req.params.id;

  // validate order id
  if (!mongoose.isValidObjectId(orderID)) {
    // error response
    return res.status(422).json({
      status: false,
      code: 422,
      message: 'Order id is not valid.'
    });
  }


  // read order by id from orders collections
  Order.findById(orderID)
    .populate('user', 'name email')
    .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    .then(order => {

      // if order not exists
      if (!order) {
        // success response
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Order not exists.',
        });
      }

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Order by id retreived.',
        order: order
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to get order by id.',
        error: error
      });
    });

});


/*
  URL: api/v1/orders
  Method: POST
  Desc: create new order
*/
router.post('/', async (req, res) => {

  // save order items in order_items collection
  const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    });

    newOrderItem = await newOrderItem.save();

    // return new item id
    return newOrderItem._id;
  }));

  // resolve promises
  let resolvedPromise = await orderItemsIds;

  // create new order
  const newOrder = new Order({
    orderItems: resolvedPromise,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user
  });

  // save order
  let order = null;

  try {
    order = await newOrder.save();
  } catch (error) {
    // error response
    return res.status(502).json({
      status: false,
      code: 502,
      message: 'Database error to add order.',
      error: error
    });
  }

  // check if order is saved
  if (!order) {
    // error response
    return res.status(502).json({
      status: false,
      code: 502,
      message: 'Unable to add order.'
    });
  }

  // success response
  return res.status(200).json({
    status: true,
    code: 200,
    message: 'Order added into database.',
    order: order
  });
});


// export router
module.exports = router;