const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create product schema
const productSchema = new Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true
  }
});


// export product schema / model
module.exports = mongoose.model('products', productSchema);