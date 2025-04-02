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

// Add To Cart - ensure it's adding items properly
exports.addToCart = async (req, res) => {
  try {
    console.log("addToCart called with body:", req.body);
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, cartItems: [], totalPrice: 0 });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add or update item
    const existingItemIndex = cart.cartItems.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      cart.cartItems[existingItemIndex].quantity += quantity;
      cart.cartItems[existingItemIndex].subtotal = 
        cart.cartItems[existingItemIndex].quantity * product.price;
    } else {
      cart.cartItems.push({
        productId,
        quantity,
        subtotal: product.price * quantity
      });
    }

    // Update total price
    cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Save cart
    await cart.save();
    
    console.log("Cart saved successfully:", cart.cartItems);
    return res.status(200).json(cart.cartItems);
  } catch (error) {
    console.error("Error in addToCart:", error);
    return res.status(500).json({ message: error.message });
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
    console.log("updateCartQuantity called with body:", req.body);
    const { productId, newQuantity } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (!newQuantity || newQuantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find item
    const itemIndex = cart.cartItems.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update item
    cart.cartItems[itemIndex].quantity = newQuantity;
    cart.cartItems[itemIndex].subtotal = newQuantity * product.price;

    // Update total price
    cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Save cart
    await cart.save();
    
    console.log("Cart updated successfully:", cart.cartItems);
    return res.status(200).json(cart.cartItems);
  } catch (error) {
    console.error("Error in updateCartQuantity:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getActiveCart = async (req, res) => {
  try {
    console.log("getActiveCart called for user:", req.user.id);
    const userId = req.user.id;
    
    // Find cart
    const cart = await Cart.findOne({ userId });
    
    // Return empty array if no cart or empty cart
    if (!cart || !cart.cartItems.length === 0) {
      console.log("No cart items found, returning empty array");
      return res.status(200).json([]);
    }
    
    // Option: Filter to only include items with active products
    const activeCartItems = [];
    for (const item of cart.cartItems) {
      const product = await Product.findById(item.productId);
      if (product && product.isActive) {
        activeCartItems.push(item);
      }
    }
    
    console.log("Returning active cart items:", activeCartItems);
    return res.status(200).json(activeCartItems);
  } catch (error) {
    console.error("Error in getActiveCart:", error);
    return res.status(500).json({ message: error.message });
  }
};