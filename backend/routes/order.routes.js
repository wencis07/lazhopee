const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Store = require('../models/store.model');
const { auth } = require('../middleware/auth.middleware');

// ===== CUSTOMER =====

// POST checkout — create order for ONE STORE ONLY
router.post('/checkout', auth, async (req, res) => {

  try {
  const { address, storeId } = req.body;
    const cartItems = await Cart.find({
      userId: req.user.id,
      store: storeId
    }).populate({
      path: 'product',
      populate: {
        path: 'store'
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: 'No items from this store.'
      });
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    const order = new Order({

      customer: req.user.id,

      store: storeId,

      items: cartItems.map(item => ({
        product: item.product._id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1
      })),

      totalPrice,

      address: address,

      status: 'Pending'

    });

    await order.save();

    // remove ONLY this store's items
    await Cart.deleteMany({
      userId: req.user.id,
      store: storeId
    });

    res.status(201).json({
      message: 'Order placed!',
      order
    });
  }
  catch(err){

    res.status(500).json({
      message: err.message
    });

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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      });
    }

    // Only Pending orders can be confirmed
    if (order.status !== 'Pending') {
      return res.status(400).json({
        message: `This order cannot be confirmed because it is already ${order.status}.`
      });
    }

    order.status = 'Confirmed';
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      message: 'Order confirmed!',
      order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// PATCH cancel order (store owner)
// PATCH cancel order (store owner)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({
        message: `This order cannot be cancelled because it is already ${order.status}.`
      });
    }

    order.status = 'Cancelled';
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      message: 'Order cancelled!',
      order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      });
    }

    if (order.status !== 'Confirmed') {
      return res.status(400).json({
        message: `Cannot pick up an order that is ${order.status}.`
      });
    }

    order.status = 'Shipped';
    order.courier = req.user.id;
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      message: 'Order picked up!',
      order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }

});

// PATCH courier marks as delivered
router.patch('/:id/deliver', auth, async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      });
    }

    // Only shipped orders can be delivered
    if (order.status !== 'Shipped') {
      return res.status(400).json({
        message: `Cannot deliver an order that is ${order.status}.`
      });
    }

    order.status = 'Delivered';
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      message: 'Order delivered!',
      order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// CUSTOMER confirms order received
router.patch('/:id/received', auth, async (req, res) => {
  try {

    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({
        message: 'Only delivered orders can be completed.'
      });
    }

    order.status = 'Completed';
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      message: 'Order completed successfully!',
      order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
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

//CUSTOMER CANCEL ORDER 
router.patch('/:id/customer-cancel', auth, async (req, res) => {
  try {

    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      });
    }

    // Customer can only cancel while Pending
    if (order.status !== 'Pending') {
      return res.status(400).json({
        message: 'This order has already been processed and can no longer be cancelled.'
      });
    }

    order.status = 'Cancelled';
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      message: 'Order cancelled successfully.',
      order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;

