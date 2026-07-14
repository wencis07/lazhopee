const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address:   { type: String, default: ''},
  latitude:  { type: Number, default: 13.1391},
  longitude: { type: Number, default: 123.7438},
  isActive:  { type: Boolean, default: false }, // needs admin approval
  isApproved:{ type: Boolean, default: false },
  allowedCategories: {type: [String], default:[]},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);