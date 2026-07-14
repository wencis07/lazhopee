const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  imageUrl: { type: String },
  store:    { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
});

module.exports = mongoose.model('Cart', cartSchema);