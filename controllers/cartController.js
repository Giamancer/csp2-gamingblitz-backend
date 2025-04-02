//[SECTION] Dependencies and Modules
const User = require("../models/User");
const Cart = require("../models/Cart");
const auth = require("../auth");
const Product = require("../models/Product");

const { errorHandler } = auth;

// Retrieve User's Cart
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
// Add to Cart ORIGINAL
/*exports.addToCart = async (req, res) => {
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
*/

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Ensure quantity is valid
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find the active product by its ID
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product is not available or not active' });
    }

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
      existingItem.subtotal = existingItem.quantity * product.price;
    } else {
      // If the item doesn't exist, add it to the cart
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

    // Return the updated cart items as an array - this matches what the tests expect
    res.status(200).json(cart.cartItems);
  } catch (error) {
    errorHandler(error, res);
  }
};


// Update Cart Quantity ORIGINAL
/*exports.updateCartQuantity = async (req, res) => {
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
*/
exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    const userId = req.user.id;

    // Ensure the newQuantity is a valid number and greater than 0
    if (isNaN(newQuantity) || newQuantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find the active product by its ID
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product is not available or not active' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // If no cart is found, return an error
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item to be updated in the cart
    const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

    // If the item doesn't exist in the cart, return an error
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    // Update the quantity and recalculate the subtotal
    cart.cartItems[itemIndex].quantity = newQuantity;
    cart.cartItems[itemIndex].subtotal = newQuantity * product.price;

    // Update the total price
    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the updated cart
    await cart.save();

    // Return the updated cart items as an array - this matches what the tests expect
    res.status(200).json(cart.cartItems);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports.getActiveCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.cartItems.length === 0) {
            // Return empty array for empty cart
            return res.status(200).json([]);
        }

        // Return cartItems as an array directly
        res.status(200).json(cart.cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving active cart.", error: error.message });
    }
};