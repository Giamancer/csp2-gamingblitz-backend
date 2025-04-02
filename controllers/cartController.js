//[SECTION] Dependencies and Modules
const User = require("../models/User");
const Cart = require("../models/Cart");
const auth = require("../auth");
const Product = require("../models/Product");

const { errorHandler } = auth;

// Retrieve User's Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const userCart = await Cart.findOne({ userId: userId })
      .populate('cartItems.productId'); // Updated path to 'cartItems.productId'

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(userCart);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, subtotal } = req.body;
    const userId = req.user.id;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, cartItems: [], totalPrice: 0 });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.cartItems.find(item => item.productId.toString() === productId);

    if (existingItem) {
      // If the item exists, update the quantity and subtotal
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.productId.price;
    } else {
      // If the item doesn't exist, add it to the cart
      const product = await Product.findById(productId);
      cart.cartItems.push({
        productId,
        quantity,
        subtotal: product.price * quantity
      });
    }

    // Update the total price of the cart
    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update Cart Quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    const userId = req.user.id;

    // Ensure the newQuantity is a valid number and greater than 0
    if (isNaN(newQuantity) || newQuantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId }).populate('cartItems.productId', 'price');

    // If no cart is found, return an error
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item to be updated in the cart
    const itemIndex = cart.cartItems.findIndex(item => item.productId._id.toString() === productId);

    // If the item doesn't exist in the cart, return an error
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    const product = cart.cartItems[itemIndex].productId;

    // Ensure the price is a valid number
    if (isNaN(product.price)) {
      return res.status(400).json({ message: 'Invalid product price' });
    }

    // Update the quantity and recalculate the subtotal
    cart.cartItems[itemIndex].quantity = newQuantity;
    cart.cartItems[itemIndex].subtotal = newQuantity * product.price;

    // Update the total price
    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(error, res);
  }
};