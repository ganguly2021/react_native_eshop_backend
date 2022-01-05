// import mongoose
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;

// connect to database
mongoose.connect(db_url)
  .then(link => {
    console.log('Database Connection Established.');
  }).catch(error => {
    console.log('Failed to connect with MongoDB.');
  });

