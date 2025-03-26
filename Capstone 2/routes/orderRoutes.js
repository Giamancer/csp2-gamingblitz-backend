//[SECTION] Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

/*router.post('/enroll', verify, enrollmentController.enroll);

router.get('/get-enrollments', verify, enrollmentController.getEnrollments);

router.put('/update-status', verify, verifyAdmin, enrollmentController.updateEnrollmentStatus);
*/
module.exports = router;