const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');

// GET all cart items
router.get('/', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add to cart
router.post('/', async (req, res) => {
  const item = new Cart(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST checkout - clears cart
router.post('/checkout', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Checkout successful, cart cleared!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE clear cart
router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;