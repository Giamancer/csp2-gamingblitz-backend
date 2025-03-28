//[SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require('../models/User');
const auth = require("../auth");
const { errorHandler } = auth;

//[SECTION] Check if the email already exists
/*
    Steps: 
    1. Use mongoose "find" method to find duplicate emails
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.checkEmailExists = (req, res) => {

    if(req.body.email.includes("@")){
        return User.find({ email : req.body.email })
        .then(result => {

            if (result.length > 0) {
                return res.status(409).send({ message: "Duplicate email found"});
            } else {
                return res.status(404).send({ message: "No duplicate email found"});
            };
        })
        .catch(error => errorHandler(error, req, res));  
    } else {
        res.status(400).send({ message: "Invalid email format"});
    }
    
};

//[SECTION] User Registration
module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Invalid email format' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
    }
};


//[SECTION] User Login
module.exports.loginUser = (req, res) => {
    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ 
                        message: 'User logged in successfully',
                        access : auth.createAccessToken(result)
                        });
                } else {
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res)); 
    } else {
        res.status(400).send({ message: 'Invalid email format' });
    }
    
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

        if(!user){
            // if the user has invalid token, send a message 'invalid signature'.
            return res.status(403).send({ message: 'invalid signature' })
        }else {
            // if the user is found, return the user.
            user.password = "";
            return res.status(200).send(user);
        }  
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.resetPassword = async (req, res) => {
    try {
        // Hash new password
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

        // Update user password in DB
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ message: "Password successfully reset" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.updateProfile = async(req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNumber } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNumber },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}


module.exports.updateUserToAdmin = async (req, res) => {
    try {
        const adminUserId = req.user.id; // Extract admin ID from JWT token
        const { userId } = req.body; // Get the user ID from request body
        console.log(req.user.id);
        // Find the admin user and check if they are actually an admin
        const adminUser = await User.findById(adminUserId);
        if (!adminUser) {
            return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }

        // Find the target user
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's role to admin
        userToUpdate.role = 'admin';
        await userToUpdate.save();

        res.status(200).json({ message: "User successfully updated to admin" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};