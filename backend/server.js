const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const storeRoutes = require('./routes/store.routes');
const Category = require('./models/category.model'); 

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/store', storeRoutes);

// Public categories route 
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    app.listen(process.env.PORT || 3000, () => {
      console.log('✅ Server running on http://localhost:3000');
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));