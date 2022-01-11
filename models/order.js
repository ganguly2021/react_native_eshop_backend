const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create order schema
const orderSchema = new Schema({
  orderItems: [{
    type: Schema.Types.ObjectId,
    ref: 'order_items',
    required: true
  }],
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
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  dateOrdered: {
    type: Date,
    default: Date.now
  }
});

// create virtual id key
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', { virtuals: true });

// export order schema / model
module.exports = mongoose.model('orders', orderSchema);