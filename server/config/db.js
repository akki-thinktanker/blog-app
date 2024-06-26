const mongoose = require('mongoose');

const connectDB = () => {
  try {
    mongoose.connect('mongodb://localhost:27017/Post_crud').then(() => {
      console.log('DB connection successful');
    });
  } catch (e) {
    console.error('Error connecting to MongoDB');
  }
};

module.exports = connectDB;
