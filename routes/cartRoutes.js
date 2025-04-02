//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getCart);

// Add To Cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Update Cart Quantity
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

module.exports = router;