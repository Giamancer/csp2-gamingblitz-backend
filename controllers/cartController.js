// Dependencies and Modules
const bcrypt = require('bcrypt');
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../auth");

const { errorHandler } = auth;


// Retrieve user's cart
module.exports.getCart = (req, res) => {
    console.log("getCart accessed");
    const userId = req.user.id; // Extract user ID from JWT
    console.log("User ID:", userId);

    Cart.findOne({ userId })
        .then((cart) => {
            if (!cart) {
                console.log("No cart found for user:", userId);
                // Instead of 404, return an empty cart structure
                return res.status(200).json({
                    cart: {
                        cartItems: [],
                        totalPrice: 0
                    }
                });
            }

            console.log("Cart found:", cart);
            res.status(200).json({
                cart: {
                    _id: cart._id,
                    userId: cart.userId,
                    cartItems: cart.cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        subtotal: item.subtotal
                    })),
                    totalPrice: cart.totalPrice,
                    orderedOn: cart.orderedOn,
                    __v: cart.__v
                }
            });
        })
        .catch((error) => {
            console.error("Error retrieving cart:", error);
            res.status(500).json({ message: "Error retrieving cart.", error: error.message });
        });
};

// Add to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, price, quantity } = req.body;
        
        // Check if this product is already in cart
        const existingCartItem = await Cart.findOne({ 
            userId: req.user.id,
            productId: productId
        });
        
        if (existingCartItem) {
            // Update quantity and subtotal if product already in cart
            existingCartItem.quantity += quantity;
            existingCartItem.subtotal = existingCartItem.price * existingCartItem.quantity;
            await existingCartItem.save();
            
            // Get all cart items to return
            const allCartItems = await Cart.find({ userId: req.user.id });
            return res.status(200).json(allCartItems);
        } 
        
        // Calculate subtotal
        const subtotal = price * quantity;
        
        // Create new cart item
        const newCartItem = new Cart({
            userId: req.user.id,
            productId,
            price,
            quantity,
            subtotal
        });
        
        await newCartItem.save();
        
        // Get all cart items to return
        const allCartItems = await Cart.find({ userId: req.user.id });
        res.status(200).json(allCartItems);
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: error.message });
    }
};




// Change Product Quantity in Cart
exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Find cart item
        const cartItem = await Cart.findOne({ 
            userId: req.user.id,
            productId: productId
        });
        
        if (!cartItem) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            await Cart.deleteOne({ _id: cartItem._id });
        } else {
            // Update quantity and subtotal
            cartItem.quantity = quantity;
            cartItem.subtotal = cartItem.price * quantity;
            await cartItem.save();
        }
        
        // Get all cart items to return
        const allCartItems = await Cart.find({ userId: req.user.id });
        res.status(200).json(allCartItems);
        
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        res.status(500).json({ error: error.message });
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


exports.getActiveCart = async (req, res) => {
    try {
        const activeCartItems = await Cart.find({ userId: req.user.id });
        console.log("Active cart items:", activeCartItems);
        res.status(200).json(activeCartItems || []);
    } catch (error) {
        console.error("Error getting active cart:", error);
        res.status(500).json({ error: error.message });
    }
};

