const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String},
  store:    {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true}
});

module.exports = mongoose.model('Product', productSchema);