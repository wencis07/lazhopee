const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive:  { type: Boolean, default: false }, // needs admin approval
  isApproved:{ type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);