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

// GET my products
router.get('/products', auth, isStoreOwner, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD product to store
router.post('/products', auth, isStoreOwner, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });

    if (!store || !store.isApproved) {
      return res.status(403).json({ message: 'Store not approved yet' });
    }

    if (!store.allowedCategories.includes(req.body.category)) {
      return res.status(403).json({
        message: `You are not allowed to sell in "${req.body.category}". Allowed categories: ${store.allowedCategories.join(', ')}`
      });
    }
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
    const store = await Store.findOne({ owner: req.user.id });

    if (req.body.category && !store.allowedCategories.includes(req.body.category)) {
      return res.status(403).json({
        message: `You are not allowed to sell in "${req.body.category}"`
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, req.body, { new: true }
    );
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