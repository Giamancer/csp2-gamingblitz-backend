// Dependencies and Modules
const bcrypt = require('bcrypt');
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../auth");

const { errorHandler } = auth;


// Retrieve user's cart
module.exports.getCart = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(404).send({ message: "Cart is empty" });
        }

        return res.status(200).send({
            cart: {
                ...cart.toObject(),
                cartItems: cart.cartItems.map(({ productId, quantity, subtotal, _id }) => 
                    ({ productId, quantity, subtotal, _id }))
            }
        });

    } catch (error) {
        return res.status(500).send({ error: { message: error.message, errorCode: "SERVER_ERROR" } });
    }
};



// Add to cart
module.exports.addToCart = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).send({ message: "Valid product ID and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, cartItems: [], totalPrice: 0 });
        }

        const existingItem = cart.cartItems.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * product.price;
        } else {
            cart.cartItems.push({ productId, quantity, subtotal: product.price * quantity });
        }

        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

        const savedCart = await cart.save();

        return res.status(201).send({
            message: "Item added to cart successfully",
            cart: savedCart
        });

    } catch (error) {
        return res.status(500).send({ error: { message: error.message, errorCode: "SERVER_ERROR" } });
    }
};



// Change Product Quantity in Cart
module.exports.updateCartQuantity = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined || quantity < 0) {
            return res.status(400).send({ message: "Invalid product ID or quantity" });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        let cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

        if (!cartItem) {
            return res.status(404).send({ message: "Item not found in cart" });
        }

        if (quantity === 0) {
            cart.cartItems = cart.cartItems.filter(item => !item.productId.equals(productId));
        } else {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }

            cartItem.quantity = quantity;
            cartItem.subtotal = quantity * product.price;
        }

        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: "Item quantity updated successfully",
            updatedCart: updatedCart
        });

    } catch (error) {
        return res.status(500).send({ error: { message: error.message, errorCode: "SERVER_ERROR" } });
    }
};


// Remove Item From Cart
module.exports.removeFromCart = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        const { productId } = req.params;

        if (!productId) {
            return res.status(400).send({ message: "Invalid product ID" });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        let cartItemIndex = cart.cartItems.findIndex(
            item => item.productId && item.productId.toString() === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).send({ message: "Item not found in cart" });
        }

        const removedItem = cart.cartItems.splice(cartItemIndex, 1)[0];

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        cart.totalPrice -= product.price * removedItem.quantity;
        if (cart.totalPrice < 0) cart.totalPrice = 0;

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: "Item removed from cart successfully",
            updatedCart: updatedCart
        });

    } catch (error) {
        return res.status(500).send({ error: { message: error.message, errorCode: "SERVER_ERROR" } });
    }
};


//Clear Cart
module.exports.clearCart = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        if (cart.cartItems.length === 0) {
            return res.status(400).send({ message: "Cart is already empty" });
        }

        cart.cartItems = [];
        cart.totalPrice = 0;

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: "Cart cleared successfully",
            cart: updatedCart
        });

    } catch (error) {
        return res.status(500).send({ error: { message: error.message, errorCode: "SERVER_ERROR" } });
    }
};


module.exports.getActiveCart = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the verified token
        
        // Find the user's active cart
        const activeCart = await Cart.findOne({ userId, isActive: true }).populate("items.productId");

        if (!activeCart) {
            return res.status(404).json({ message: "No active cart found." });
        }

        res.status(200).json(activeCart);
    } catch (error) {
        console.error("Error fetching active cart:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};