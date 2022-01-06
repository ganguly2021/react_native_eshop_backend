const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create product schema
const productSchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  richDescription: {
    type: String
  },
  image: {
    type: String
  },
  images: {
    type: [String]
  },
  brand: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },
  countInStock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});


// export product schema / model
module.exports = mongoose.model('products', productSchema);