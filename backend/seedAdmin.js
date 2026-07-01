const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

const adminUser = {
  name: 'Admin',
  email: 'admin@lazshopee.com',
  password: 'admin123',
  role: 'admin'
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: adminUser.email });
    if (existing) {
      console.log('⚠️ Admin already exists, skipping creation.');
    } else {
      const user = new User(adminUser);
      await user.save();
      console.log('✅ Admin user created successfully!');
    }

    mongoose.connection.close();
  })
  .catch(err => console.error('❌ Error:', err));