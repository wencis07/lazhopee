const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// GET all products — include owner info
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name _id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add product
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;