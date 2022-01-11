const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create order item schema
const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

// create virtual id key
orderItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderItemSchema.set('toJSON', { virtuals: true });



// create order item model
module.exports = mongoose.model('order_items', orderItemSchema);