const express = require('express');
const router = express.Router();
const Store = require('../models/store.model');
const Product = require('../models/product.model');
const { auth, isStoreOwner } = require('../middleware/auth.middleware');

// CREATE store
router.post('/', auth, isStoreOwner, async (req, res) => {
  try {
    const store = new Store({ ...req.body, owner: req.user.id });
    await store.save();
    res.status(201).json({ message: 'Store created, waiting for admin approval', store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET my store
router.get('/my-store', auth, isStoreOwner, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD product to store
router.post('/products', auth, isStoreOwner, async (req, res) => {
  try {
    const product = new Product({ ...req.body, owner: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product
router.put('/products/:id', auth, isStoreOwner, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/products/:id', auth, isStoreOwner, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;