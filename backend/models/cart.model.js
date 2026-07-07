const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  imageUrl: { type: String }
});

module.exports = mongoose.model('Cart', cartSchema);