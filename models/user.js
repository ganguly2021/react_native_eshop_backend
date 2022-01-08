const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
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
  phone: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  street: {
    type: String,
    default: ''
  },
  apartment: {
    type: String,
    default: ''
  },
  zip: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

// create mongoose virtual key
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// set toJSON virtual
userSchema.set('toJSON', { virtuals: true });


// export user schema / model
module.exports = mongoose.model('users', userSchema);