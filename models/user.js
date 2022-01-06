const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user schema
const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  street: {
    type: String
  },
  apartment: {
    type: String
  },
  city: {
    type: String
  },
  pin: {
    type: String
  },
  country: {
    type: String,
  },
  phone: {
    type: Number
  }
});


// export user schema / model
module.exports = mongoose.model('users', userSchema);