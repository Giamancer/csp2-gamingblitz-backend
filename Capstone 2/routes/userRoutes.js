//[SECTION] Dependencies and Modules
const express = require('express');
const userController = require('../controllers/userController');

const { verify } = require("../auth");
const passport = require("passport");

//[SECTION] Routing Component
const router = express.Router();

/*router.post("/check-email", userController.checkEmailExists);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/details", verify, userController.getProfile);

router.post("/reset-password", verify, userController.resetPassword);

router.put('/profile', verify, userController.updateProfile);

router.put('/updateAdmin', verify, userController.updateUserAsAdmin);

*/
module.exports = router;


