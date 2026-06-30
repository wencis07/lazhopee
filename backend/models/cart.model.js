const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: {type: String}
});

module.exports = mongoose.model('Cart', cartSchema);