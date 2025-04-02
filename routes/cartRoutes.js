//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

console.log("Cart routes registered:");
console.log(" - POST /add-to-cart");
console.log(" - GET /get-cart");
console.log(" - PATCH /update-cart-quantity");
console.log(" - GET /active");

// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getCart);

// Add To Cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Update Cart Quantity
router.put("/update-cart-quantity", verify, cartController.updateCartQuantity);

router.get("/active", verify, cartController.getActiveCart); 

module.exports = router;