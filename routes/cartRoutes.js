//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getCart);

// Add To Cart
router.post("/active/add-to-cart", verify, cartController.addToCart);

// Update Cart Quantity
router.put("/active/update-cart-quantity", verify, cartController.updateCartQuantity);

router.get("/active", verify, cartController.getActiveCart); 

module.exports = router;