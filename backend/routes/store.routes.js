const express = require('express');
const router = express.Router();
const Store = require('../models/store.model');
const Product = require('../models/product.model');
const { auth, isStoreOwner } = require('../middleware/auth.middleware');

// CREATE store
router.post('/', auth, isStoreOwner, async (req, res) => {
  try {
    const existingStore = await Store.findOne({owner: req.user.id});
    
    if (existingStore) {return res.status(400).json({
        message: 'You already have a store.'
      });
    }
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
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(store);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my products
router.get('/products', auth, isStoreOwner, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    const products = await Product.find({ store: store._id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

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
    const product = new Product({ ...req.body, store: store._id });
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
      { _id: req.params.id, store: store._id }, req.body, { new: true }
    );
    if (!product) { return res.status(404).json({message: 'Product not found'
      });
    }
    res.json(product);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/products/:id', auth, isStoreOwner, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    await Product.findOneAndDelete({ _id: req.params.id, store: store._id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE MY STORE
router.patch('/my-store', auth, isStoreOwner, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });

    if (!store) {
      return res.status(404).json({
        message: 'Store not found'
      });
    }
      store.name = req.body.name;
      store.address = req.body.address;
      store.latitude = req.body.latitude;
      store.longitude = req.body.longitude;

    await store.save();

    res.json({
      message: 'Store updated successfully!',
      store
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

const Rating = require('../models/rating.model');
const User = require('../models/user.model');

// PUBLIC STORE PROFILE
router.get('/:id', async (req, res) => {

  try {

    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        message: 'Store not found'
      });
    }

    const owner = await User.findById(store.owner)
      .select('name email');

    const products = await Product.find({
      store: store._id
    });

    const ratings = await Rating.find({
      store: store._id
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.shopRating, 0) / ratings.length
        : 0;

    res.json({

      store,

      owner,

      products,

      averageRating,

      totalReviews: ratings.length

    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;