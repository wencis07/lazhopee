const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store:      { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  items:      [
    {
      name:     { type: String, required: true },
      price:    { type: Number, required: true },
      imageUrl: { type: String },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, required: true },
  status:     { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  courier:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address:    { type: String },
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);