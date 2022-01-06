const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create order schema
const orderSchema = new Schema({
  orderItems: {
    type: [Schema.Types.ObjectId],
    ref: 'order_items'
  },
  shippingAddress1: {
    type: String,
    required: true
  },
  shippingAddress2: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId
  },
  dateOrdered: {
    type: Date,
    default: Date.now()
  }
});


// export order schema / model
module.exports = mongoose.model('orders', orderSchema);