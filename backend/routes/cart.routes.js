const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const { auth } = require('../middleware/auth.middleware');

// GET cart items for logged in user only
router.get('/', auth, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add to cart — attach user ID
router.post('/', auth, async (req, res) => {
  const item = new Cart({ ...req.body, userId: req.user.id });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST checkout - clears only this user's cart
router.post('/checkout', auth, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: 'Checkout successful, cart cleared!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE clear cart — only this user's cart
router.delete('/', auth, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;