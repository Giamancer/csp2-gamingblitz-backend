//[SECTION] Activity: Dependencies and Modules
const express = require("express");
const courseController = require("../controllers/course");
const auth = require("../auth");
const {verify, verifyAdmin} = auth;

//[SECTION] Activity: Routing Component
const router = express.Router();


router.post("/", verify, verifyAdmin, courseController.addCourse);

router.get("/all", verify, verifyAdmin, courseController.getAllCourses);

router.get("/", courseController.getAllActive);

router.get("/specific/:id", courseController.getCourse);

router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);

router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse);

router.post('/search', verify, courseController.searchCoursesByPrice);

//[SECTION] Route for searching courses by name
// Update endpoint to remove /courses as we already group our routes under this in index.js
router.post('/search', courseController.searchCoursesByName);


module.exports = router;