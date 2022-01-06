const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  icon: {
    type: String
  }
});


// export category schema / model
module.exports = mongoose.model('categories', categorySchema);