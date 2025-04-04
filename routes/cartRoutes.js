//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

// Get Active Cart
router.get("/active-cart-items", verify, cartController.getActiveCart);

// Add to Cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Retrieve User's Cart 
router.get("/get-cart", verify, cartController.getCart);

// Update Cart Quantity
router.put("/update-cart-quantity", verify, cartController.updateCartQuantity);

module.exports = router;

