//[SECTION] Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

router.post('/checkout', verify, orderController.createOrder);

router.get('/my-orders', verify, orderController.retrieveOrder);

router.get('/all-orders', verify, verifyAdmin, orderController.retrieveAllOrders);

module.exports = router;