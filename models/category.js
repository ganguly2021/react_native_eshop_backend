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
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});


// export category schema / model
module.exports = mongoose.model('categories', categorySchema);