//[SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

module.exports.createOrder = (req, res) => {
    // Extract user ID from JWT token
    const userId = req.user.id;

    // Find user's cart
    Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            if (!cart.cartItems.length) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            // Create new order
            const newOrder = new Order({
                userId,
                productsOrdered: cart.cartItems,
                totalPrice: cart.totalPrice,
            });

            // Save order
            newOrder.save()
                .then(order => {
                    res.status(201).json({ message: 'Order created successfully', order });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error saving order', error: error.message });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error finding cart', error: error.message });
        });
};

// Retrieve Logged-in User's Orders
module.exports.retrieveOrder = (req, res) => {
    console.log("Request received at /orders/my-orders"); // Debugging log

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    if (req.user.role && req.user.role === "admin") {
        return res.status(403).json({ message: 'Forbidden: Admins cannot access this resource' });
    }

    const userId = req.user.id;

    Order.find({ userId })
        .then(orders => {
            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: 'No orders found for this user' });
            }
            res.status(200).json({ orders });
        })
        .catch(error => {
            console.error('Error retrieving orders:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        });
};



// Retrieve All Orders
module.exports.retrieveAllOrders = (req, res) => {
    Order.find()
        .populate('productsOrdered.productId', 'name price') // Populate product info
        .populate('userId', 'name email') // Populate user info: name and email
        .then(orders => {
            res.status(200).json({ orders });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error retrieving orders', error: error.message });
        });
};
