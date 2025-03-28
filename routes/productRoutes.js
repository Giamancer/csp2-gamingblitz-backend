//[SECTION] Activity: Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../auth");
const {verify, verifyAdmin} = auth;

//[SECTION] Activity: Routing Component
const router = express.Router();

router.post("/", verify, verifyAdmin, productController.createProduct);

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.get("/active", verify, verifyAdmin, productController.getActiveProducts);

router.get("/:productId", productController.getProduct);

// Route for updating a product
router.patch('/:productId/update', verify, verifyAdmin, productController.updateProduct);

// Route for archiving a product
router.patch('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// Route for activating a product
router.patch('/:productId/activate', verify, verifyAdmin, productController.activateProduct);

/*router.post("/", verify, verifyAdmin, courseController.addCourse);

router.get("/all", verify, verifyAdmin, courseController.getAllCourses);

router.get("/", courseController.getAllActive);

router.get("/specific/:id", courseController.getCourse);

router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);

router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse);


//[SECTION] Route for searching courses by name
// Update endpoint to remove /courses as we already group our routes under this in index.js
router.post('/search', courseController.searchCoursesByName);

router.post("/searchPrice", courseController.searchCoursesByPrice);*/


module.exports = router;