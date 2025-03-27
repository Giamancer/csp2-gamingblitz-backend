//[SECTION] Dependencies and Modules
const express = require('express');
const userController = require('../controllers/userController');
const { verify } = require("../auth");
// const passport = require("passport");

//[SECTION] Routing Component
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.retrieveUserDetails);

router.patch("/:userId/set-as-admin", verify, userController.setAsAdmin);

router.patch("/update-password", verify, userController.updatePassword);

/*router.post("/check-email", userController.checkEmailExists);

router.post("/details", verify, userController.getProfile);

router.post("/reset-password", verify, userController.resetPassword);

*/
module.exports = router;


