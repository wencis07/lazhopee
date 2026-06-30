const mongoose = require('mongoose');
const Product = require('./models/product.model');
require('dotenv').config();

const products = [
  { name: 'Black And White Mystery MT Helmet', price: 7446, imageUrl: 'Product_01.jpg' },
  { name: 'White Black and Red Fade Interstellar Edition', price: 7061, imageUrl: 'Product_02.jpg' },
  { name: 'Classic Orange Polo Shirt', price: 599, imageUrl: 'Product_03.jpg' },
  { name: 'Casual White Sneakers', price: 1299, imageUrl: 'Product_04.png' },
  { name: 'Minimalist Canvas Tote Bag', price: 450, imageUrl: 'Product_05.png' },
  { name: 'Wireless Bluetooth Headphones', price: 2499, imageUrl: 'Product_06.png' },
  { name: 'Leather Wallet Brown', price: 899, imageUrl: 'Product_07.jpg' },
  { name: 'Stainless Steel Water Bottle', price: 650, imageUrl: 'Product_08.jpg' },
  { name: 'Portable Phone Stand', price: 299, imageUrl: 'Product_09.png' },
  { name: 'Cotton Round Neck T-Shirt', price: 399, imageUrl: 'Product_10.png' },
  { name: 'Analog Wrist Watch Classic', price: 3299, imageUrl: 'Product_11.png' },
  { name: 'Sunglasses UV400 Protection', price: 799, imageUrl: 'Product_12.jpg' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ 12 Products seeded successfully!');
    mongoose.connection.close();
  })
  .catch(err => console.error('❌ Error:', err));