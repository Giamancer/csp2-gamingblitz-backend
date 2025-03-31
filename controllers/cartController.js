//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Cart = require("../models/Cart");
const auth = require("../auth");
const Product = require("../models/Product"); // Adjust path if needed

const { errorHandler } = auth;

module.exports.addToCart = (req, res) => {
    const { productId, price, quantity, subtotal } = req.body;
    const userId = req.user.id; // Get user ID from verified token

    if (!productId || !price || !quantity || !subtotal) {
        return res.status(400).json({ message: "All fields are required." });
    }

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            const newCartItem = new Cart({
                userId,
                productId,
                price,
                quantity,
                subtotal,
            });

            return newCartItem.save();
        })
        .then((savedCartItem) => {
            res.status(201).json({
                message: "Item added to cart successfully",
                cart: {
                    _id: savedCartItem._id,
                    userId: savedCartItem.userId,
                    cartItems: [
                        {
                            productId: savedCartItem.productId,
                            quantity: savedCartItem.quantity,
                            subtotal: savedCartItem.subtotal,
                            _id: savedCartItem._id, // Ensure structure matches
                        },
                    ],
                    totalPrice: savedCartItem.subtotal,
                    codeWord: new Date().toISOString(),
                    __v: 0, // Default MongoDB versioning field
                },
            });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error adding item to cart.", error: error.message });
        });
};


module.exports.getCart = (req, res) => {
    const userId = req.user.id; // Get user ID from the token

    Cart.find({ userId })
        .then((cartItems) => {
            if (!cartItems.length) {
                return res.status(404).json({ message: "Cart is empty." });
            }

            const formattedCart = {
                cart: {
                    _id: cartItems[0]._id,
                    userId: cartItems[0].userId,
                    cartItems: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                        _id: item._id
                    })),
                    totalPrice: cartItems.reduce((total, item) => total + item.subtotal, 0),
                    codeWord: new Date().toISOString(),
                    __v: 70
                }
            };

            res.status(200).json(formattedCart);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error retrieving cart.", error: error.message });
        });
};


module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId, newQuantity } = req.body;
        const userId = req.user.id; // Get authenticated user ID

        // Validate input
        if (!productId || newQuantity === undefined) {
            return res.status(400).json({ message: "Product ID and new quantity are required." });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Check if cart item exists
        const cartItem = await Cart.findOne({ userId, productId });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        // Update quantity and subtotal
        cartItem.quantity = newQuantity;
        cartItem.subtotal = product.price * newQuantity;
        await cartItem.save();

        // Format response to match expected structure
        res.status(200).json({
            message: "Cart updated successfully",
            cart: {
                _id: cartItem._id,
                userId: cartItem.userId,
                cartItems: [
                    {
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        subtotal: cartItem.subtotal,
                        _id: cartItem._id,
                    },
                ],
                totalPrice: cartItem.subtotal, // Update total price based on subtotal
                codeWord: new Date().toISOString(),
                __v: cartItem.__v,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating cart quantity.", error: error.message });
    }
};

module.exports.getActiveCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.find({ userId });

        if (!cartItems.length) {
            return res.status(404).json({ message: "No active items in cart." });
        }

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving active cart.", error: error.message });
    }
};

module.exports.getCart = (req, res) => {
    console.log("Fetching cart for user:", req.user.id); // Debugging log
    const userId = req.user.id;

    Cart.find({ userId })
        .then((cartItems) => {
            if (!cartItems.length) {
                return res.status(404).json({ message: "Cart is empty." });
            }

            const formattedCart = {
                cart: {
                    _id: cartItems[0]._id,
                    userId: cartItems[0].userId,
                    cartItems: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                        _id: item._id
                    })),
                    totalPrice: cartItems.reduce((total, item) => total + item.subtotal, 0),
                    codeWord: new Date().toISOString(),
                    __v: 70
                }
            };

            res.status(200).json(formattedCart);
        })
        .catch((error) => {
            console.error("Error retrieving cart:", error.message);
            res.status(500).json({ message: "Error retrieving cart.", error: error.message });
        });
};