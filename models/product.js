const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const opts = { toJSON: { virtuals: true } };

// create product schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  richDescription: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

// create virtual key in product document
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});


productSchema.set('toJSON', { virtuals: true });

// export product schema / model
module.exports = mongoose.model('products', productSchema);