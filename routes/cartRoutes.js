//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;
const { verifyJWT } = require("../auth"); 

const router = express.Router();


// Add to Cart (Non-Admin)
router.post("/add-to-cart", verify, cartController.addToCart);

// Retrieve User's Cart (Non-Admin)
router.get("/get-cart", verify, cartController.getCart);

// Update Cart Quantity
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);


module.exports = router;


