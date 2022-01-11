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
  URL: api/v1/orders/:id
  Method: PUT
  Desc: update order status by id
*/
router.put('/:id', (req, res) => {

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


  // update order status by id from orders collections
  Order.findByIdAndUpdate(orderID, { status: req.body.status }, { new: true })
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
        message: 'Order status updated.',
        order: order
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to update order status.',
        error: error
      });
    });

});


/*
  URL: api/v1/orders/:id
  Method: DELETE
  Desc: delete order status by id
*/
router.delete('/:id', (req, res) => {

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


  // delete order by id from orders collections
  Order.findByIdAndDelete(orderID)
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

      order.orderItems.map(async orderItemID => {
        // items from order_items collection
        await OrderItem.findByIdAndDelete(orderItemID);
      });

      // success response
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Order deleted.',
        order: order
      });
    }).catch(error => {
      // error response
      return res.status(502).json({
        status: false,
        code: 502,
        message: 'Database error to delete order.',
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

  // calculate total price of products
  const totalPrices = await Promise.all(resolvedPromise.map(async orderItemID => {
    // get product price from database
    const orderItem = await OrderItem.findById(orderItemID).populate('product', 'price');
    // calculate product price based on quantity
    const totalPrice = orderItem.product.price * orderItem.quantity;
    // return product total price
    return totalPrice;
  }));

  // add all the prices of product together
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

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
    totalPrice: totalPrice,
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


/*
  URL: api/v1/orders/get/total_sales
  Method: GET
  Desc: get total sales
*/
router.get('/get/total_sales', (req, res) => {

  Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
  ]).then(totalSales => {

    if (!totalSales) {
      // error response
      return res.status(404).json({
        status: false,
        code: 404,
        message: 'Total sales not exists'
      });
    }

    // success response
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Total sales of orders.',
      totalSales: totalSales.pop().totalSales
    });
  }).catch(error => {
    // error response
    return res.status(502).json({
      status: false,
      code: 502,
      message: 'Database error to calculate total sales.',
      error: error
    });
  });
});


// export router
module.exports = router;