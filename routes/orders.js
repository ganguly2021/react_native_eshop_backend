const express = require('express');
const router = express.Router();
const Order = require('./../models/order');
const OrderItem = require('./../models/order-item');

// middleware setup


// routes

/*
  URL: api/v1/orders
  Method: GET
*/
router.get('/', (req, res) => {
  return res.status(200).json({
    status: true,
    code: 200,
    message: 'API orders working.'
  });
});


/*
  URL: api/v1/orders
  Method: POST
  Desc: create new order
*/
router.post('/', (req, res) => {

  // save order items in order_items collection
  const orderItemsIds = req.body.orderItems.map(orderItem => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    });

    newOrderItem.save()
      .then(ot => {
        // success return orderItem id
        return ot._id;
      }).catch(error => {
        // error response
        return res.status(502).json({
          status: false,
          code: 502,
          message: 'Database error to add order items.',
          error: error
        });
      })
  });

  // create new order
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.orderItems,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user
  });

  // save order
  newOrder.save()
    .then(order => {
      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Order added into database.',
        order: order
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to add order.',
        error: error
      });
    });
});


// export router
module.exports = router;