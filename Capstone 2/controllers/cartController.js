//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Cart = require("../models/Cart");
const auth = require("../auth");

const { errorHandler } = auth;

/*
module.exports.enroll = (req, res) => {

    console.log(req.user.id);
    console.log(req.body.enrolledCourses) ;

    if(req.user.isAdmin){
        // if the user is an admin, send a message 'Admin is forbidden'.
        return res.status(403).send({ message: 'Admin is forbidden' });
    }

    let newEnrollment = new Enrollment ({
        userId : req.user.id,
        enrolledCourses: req.body.enrolledCourses,
        totalPrice: req.body.totalPrice
    })

    return newEnrollment.save()
    .then(enrolled => {
        // if the user successfully enrolled,return true and send a message 'Enrolled successfully'.
        return res.status(201).send({
            success: true,
            message: 'Enrolled successfully'
        });
    })
    .catch(error => errorHandler(error, req, res));
    
}


//[SECTION] Activity: Get enrollments
/*
    Steps:
    1. Use the mongoose method "find" to retrieve all enrollments for the logged in user
    2. If no enrollments are found, return a 404 error. Else return a 200 status and the enrollment record
*/
/*module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({userId : req.user.id})
        .then(enrollments => {
            if (enrollments.length > 0) {
                return res.status(200).send(enrollments);
            }
            return res.status(404).send({
                message: 'No enrolled courses'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { userId, courseId, status } = req.body;

        // Validate input
        if (!userId || !courseId || !status) {
            return res.status(400).json({ message: "User ID, Course ID, and Status are required." });
        }

        // Allowed statuses
        const allowedStatuses = ["Enrolled", "Completed", "Cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values: Enrolled, Completed, Cancelled." });
        }

        // Find the enrollment record
        const enrollment = await Enrollment.findOne({ userId });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment record not found for this user." });
        }

        // Find the specific course in enrolledCourses array
        const courseIndex = enrollment.enrolledCourses.findIndex(course => course.courseId === courseId);

        if (courseIndex === -1) {
            return res.status(404).json({ message: "Course not found in user's enrollment." });
        }

        // Update the status
        enrollment.status = status;
        await enrollment.save();

        res.status(200).json({ message: `Enrollment status updated to ${status} successfully.` });

    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
};*/
