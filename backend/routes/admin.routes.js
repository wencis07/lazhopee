const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// GET all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DEACTIVATE user/store account
router.patch('/users/:id/deactivate', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );

    await User.findByIdAndUpdate(store.owner, { isActive: false });

    res.json({ message: 'Account deactivated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ACTIVATE user account
router.patch('/users/:id/activate', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { isActive: true }, { new: true }
    );
    res.json({ message: 'Account activated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all stores
router.get('/stores', auth, isAdmin, async (req, res) => {
  try {
    const stores = await Store.find().populate('owner', 'name email isActive');
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// APPROVE store
router.patch('/stores/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id, { isApproved: true, isActive: true }, { new: true }
    );
    res.json({ message: 'Store approved', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DEACTIVATE store
router.patch('/stores/:id/deactivate', auth, isAdmin, async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    res.json({ message: 'Store deactivated', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ACTIVATE store
router.patch('/stores/:id/activate', auth, isAdmin, async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id, { isActive: true }, { new: true }
    );

    await User.findByIdAndUpdate(store.owner, { isActive: true });

    res.json({ message: 'Store and owner activated', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ASSIGN allowed categories to a store 👈 new route
router.patch('/stores/:id/categories', auth, isAdmin, async (req, res) => {
  try {
    const { allowedCategories } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id, { allowedCategories }, { new: true }
    );
    res.json({ message: 'Categories assigned', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD category
router.post('/categories', auth, isAdmin, async (req, res) => {
  try {
    const category = new Category({ ...req.body, createdBy: req.user.id });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category
router.delete('/categories/:id', auth, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;