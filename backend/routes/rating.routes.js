const express = require('express');
const router = express.Router();

const Rating = require('../models/rating.model');
const Order = require('../models/order.model');
const { auth } = require('../middleware/auth.middleware');

// Customer submits a rating
router.post('/', auth, async (req, res) => {

    try {

        const {
            orderId,
            productRating,
            shopRating,
            shippingRating,
            comment
        } = req.body;

        // Find the order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found.'
            });
        }

        // Make sure this customer owns the order
        if (order.customer.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Unauthorized.'
            });
        }

        // Only completed orders can be rated
        if (order.status !== 'Completed') {
            return res.status(400).json({
                message: 'Only completed orders can be rated.'
            });
        }

        // Prevent duplicate ratings
        const existing = await Rating.findOne({
            order: orderId
        });

        if (existing) {
            return res.status(400).json({
                message: 'You already rated this order.'
            });
        }

const rating = await Rating.create({
    customer: req.user.id,
    order: orderId,
    store: order.store, 
    product: order.items[0].product,
    productRating,
    shopRating,
    shippingRating,
    comment
}); 
order.hasRated = true;
await order.save();

        res.status(201).json({
        message: 'Rating submitted successfully.',rating
        });

    } catch (err){

         res.status(500).json({
            message: err.message
        });

    }

});
// STORE OWNER - VIEW REVIEWS
const Store = require('../models/store.model');

router.get('/store', auth, async (req, res) => {

    try {

        const store = await Store.findOne({
            owner: req.user.id
        });

        console.log("Logged in owner:", req.user.id);
        console.log("Store found:", store);

        const ratings = await Rating.find({
            store: store._id
        })
        .populate('customer', 'name')
        .populate('order')
        .sort({createAt: -1}); 

        console.log("Ratings found:", ratings);

        res.json(ratings);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }

});
// COURIER - VIEW DELIVERY RATINGS
router.get('/courier', auth, async (req, res) => {

    try {

        const orders = await Order.find({
            courier: req.user.id
        });

        const orderIds = orders.map(order => order._id);

        const ratings = await Rating.find({
            order: { $in: orderIds }
        })
        .populate('customer', 'name')
        .populate('order')
        .sort({ createdAt: -1 });

        res.json(ratings);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;