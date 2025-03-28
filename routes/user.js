//[SECTION] Dependencies and Modules
const express = require('express');
const userController = require('../controllers/user');

const { verify, isLoggedIn } = require("../auth");
const passport = require("passport");

//[SECTION] Routing Component
const router = express.Router();

router.post("/check-email", userController.checkEmailExists);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/details", verify, userController.getProfile);

router.post("/reset-password", verify, userController.resetPassword);

router.put('/profile', verify, userController.updateProfile);

router.put('/update-admin', verify, userController.updateUserToAdmin);

//[SECTION] Google Login
//  When a user visits /google, they are redirected to Google’s login page.
router.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],  // Requests access to the user's email and profile info from Google.       
        prompt : "select_account" // The "select_account" prompt in Google OAuth forces the user to choose an account
    }
));

router.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/users/failed',
    }),
    function (req, res) {
        res.redirect('/users/success')
    }
);

// router.get('/google/callback',
//     passport.authenticate('google', { failureRedirect: '/users/failed' }),
//     (req, res) => {
//         if (req.user.emails[0].value === "christopher.malinao@tuitt.com") {
//             return res.redirect('/users/success');
//         } else {
//             console.log(`Unauthorized login attempt`);
//             req.logout(() => res.redirect('/users/failed')); // Redirect unauthorized users
//         }
//     }
// );


router.get("/failed", (req, res) => {
    console.log('User is not authenticated');
    res.send("Failed")
})

router.get("/success",isLoggedIn, (req, res) => {
    console.log('You are logged in');
    console.log(req.user);
    res.send(`Welcome ${req.user.displayName}`)
})


router.get("/logout", (req, res) => {
    req.session.destroy((err) => { // it will clear all data in the session
        if (err) {
            console.log('Error while destroying session:', err);
        } else {
            req.logout(() => {
                console.log('You are logged out');
                res.redirect('/google');
            });
        }
    });
});


module.exports = router;


