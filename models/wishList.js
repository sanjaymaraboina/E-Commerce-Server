const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  isAdd: { type: Boolean, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Wish', wishListSchema); 
