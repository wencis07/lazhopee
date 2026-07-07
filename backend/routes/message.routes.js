const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const Product = require('../models/product.model');
const { auth } = require('../middleware/auth.middleware');

// SEND a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, productId, productName, content } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver,
      product: productId,
      productName,
      content
    });
    await message.save();
    res.status(201).json({ message: 'Message sent!', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all conversations for logged in user
router.get('/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .populate('sender', 'name role')
    .populate('receiver', 'name role')
    .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET conversation between two users about a product
router.get('/thread/:userId/:productId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      product: req.params.productId,
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
    .populate('sender', 'name role')
    .populate('receiver', 'name role')
    .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK messages as read
router.patch('/read/:userId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET unread message count
router.get('/unread', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;