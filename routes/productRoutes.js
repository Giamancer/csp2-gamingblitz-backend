//[SECTION] Activity: Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../auth");
const {verify, verifyAdmin} = auth;

//[SECTION] Activity: Routing Component
const router = express.Router();

// Create Product
router.post("/", verify, verifyAdmin, productController.createProduct);

// Retrieve All Products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Retrieve All Active Products
router.get("/active-products", verify, verifyAdmin, productController.getActiveProducts);

// Retrieve Single Product
router.get("/:productId", productController.getProduct);

// Update Product Info
router.patch('/:productId/update', verify, verifyAdmin, productController.updateProduct);

// Archive Product
router.patch('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// Activate Product
router.patch('/:productId/activate', verify, verifyAdmin, productController.activateProduct);


module.exports = router;