const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String},
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);