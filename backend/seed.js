const mongoose = require('mongoose');
const Product = require('./models/product.model');
require('dotenv').config();

const products = [
  // Caps
  { name: 'Nike Dri-FIT Club Unstructured Cap', price: 850, imageUrl: 'nike_cap.jpg', category: 'Caps' },
  { name: 'Nike Sportswear Heritage86 Futura Cap', price: 950, imageUrl: 'nike_cap2.jpg', category: 'Caps' },

  // Shirts
  { name: 'Nike Dri-FIT Miler Running Top', price: 1495, imageUrl: 'nike_shirt.jpg', category: 'Shirts' },
  { name: 'Nike Sportswear Club T-Shirt', price: 1095, imageUrl: 'nike_shirt2.jpg', category: 'Shirts' },

  // Shorts
  { name: 'Nike Dri-FIT Challenger Running Shorts', price: 1795, imageUrl: 'nike_shorts.jpg', category: 'Shorts' },
  { name: 'Nike Sportswear Club Fleece Shorts', price: 1495, imageUrl: 'nike_shorts2.jpg', category: 'Shorts' },

  // Sneakers
  { name: 'Nike Air Force 1 \'07', price: 6195, imageUrl: 'nike_shoes.jpg', category: 'Sneakers' },
  { name: 'Nike Air Max 270', price: 7495, imageUrl: 'nike_shoes2.jpg', category: 'Sneakers' },
  { name: 'Nike Revolution 6', price: 3195, imageUrl: 'nike_shoes3.jpg', category: 'Sneakers' },

  // Basketball Shoes
  { name: 'Nike LeBron Witness 8', price: 4995, imageUrl: 'nike_bballShoes.jpg', category: 'Basketball Shoes' },
  { name: 'Nike Mamba Instinct University Red', price: 7995, imageUrl: 'nike_bballShoes2.jpg', category: 'Basketball Shoes' },
  { name: 'Nike KD 16', price: 6495, imageUrl: 'nike_bballShoes3.jpg', category: 'Basketball Shoes' },

  // Bags
  { name: 'Nike Brasilia Training Duffel Bag', price: 1995, imageUrl: 'nike_bag.jpg', category: 'Bags' },
  { name: 'Nike Heritage Backpack', price: 1795, imageUrl: 'nike_bag2.jpg', category: 'Bags' },

];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Nike products seeded successfully!');
    mongoose.connection.close();
  })
  .catch(err => console.error('❌ Error:', err));