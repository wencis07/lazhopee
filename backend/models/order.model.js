const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store:      { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  items: [
{
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
    name:String,
    price:Number,
    imageUrl:String,
    quantity:Number
}],
  totalPrice: { type: Number, required: true },
  status:     { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered','Completed', 'Cancelled'],default: 'Pending'}, 
  hasRated:   { type: Boolean,default: false},
  courier:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address:    { type: String },
  isRated:    { type: Boolean, default: false}, 
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);