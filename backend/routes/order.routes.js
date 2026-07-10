const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Store = require('../models/store.model');
const { auth } = require('../middleware/auth.middleware');

// ===== CUSTOMER =====

// POST checkout — create order from cart
router.post('/checkout', auth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Get store from first cart item's product owner
    const order = new Order({
      customer: req.user.id,
      items: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1
      })),
      totalPrice,
      address: req.body.address || 'No address provided',
      status: 'Pending'
    });

    await order.save();

    // Clear cart after checkout
    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET customer's own orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('courier', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== STORE OWNER =====

// GET orders for store owner
router.get('/store-orders', auth, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const orders = await Order.find({ store: store._id })
      .populate('customer', 'name email')
      .populate('courier', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all pending orders (for store owner to see)
router.get('/pending', auth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Pending' })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH confirm order (store owner)
router.patch('/:id/confirm', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Confirmed', updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Order confirmed!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH cancel order (store owner)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled', updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Order cancelled!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== COURIER =====

// GET all confirmed orders available for pickup
router.get('/available', auth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Confirmed', courier: null })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH courier picks up order
router.patch('/:id/pickup', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Shipped', courier: req.user.id, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Order picked up!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH courier marks as delivered
router.patch('/:id/deliver', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Delivered', updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Order delivered!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET courier's active deliveries
router.get('/my-deliveries', auth, async (req, res) => {
  try {
    const orders = await Order.find({ courier: req.user.id })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;