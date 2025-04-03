//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;
const { verifyJWT } = require("../auth"); 

const router = express.Router();

router.get("/active", verify, cartController.getActiveCart);

// Add to Cart (Non-Admin)
router.post("/add-to-cart", verify, cartController.addToCart);

// Retrieve User's Cart (Non-Admin)
router.get("/get-cart", verify, cartController.getCart);

// Update Cart Quantity
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);


/*
// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getCart);

// Add To Cart
router.post("/add-to-cart", verify, (req, res, next) => {
  console.log("ADD TO CART ROUTE ACCESSED");
  next();
}, cartController.addToCart);


// Update Cart Quantity
router.put("/update-cart-quantity", verify, (req, res, next) => {
  console.log("UPDATE CART QUANTITY ROUTE ACCESSED");
  next();
}, cartController.updateCartQuantity);

// Active Cart
router.get("/active", verify, (req, res, next) => {
  console.log("ACTIVE CART ROUTE ACCESSED");
  next();
}, cartController.getActiveCart);
*/
module.exports = router;
