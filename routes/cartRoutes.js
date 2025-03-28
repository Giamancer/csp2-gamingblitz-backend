//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;
const { verifyJWT } = require("../auth"); 
console.log("verifyJWT:", verifyJWT); // Debugging Line

const router = express.Router();

// Add to Cart Route
router.post("/add-to-cart", verifyJWT, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from JWT
        const { productId, quantity, price } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({
                userId,
                cartItems: [],
                totalPrice: 0,
            });
        }

        // Check if product already exists in cart
        const existingItem = cart.cartItems.find(item => item.productId.toString() === productId);

        if (existingItem) {
            // Update quantity and subtotal
            existingItem.quantity += quantity;
            existingItem.subtotal += price * quantity;
        } else {
            // Add new product to cart
            cart.cartItems.push({
                productId,
                quantity,
                subtotal: price * quantity,
            });
        }

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

        // Save cart
        await cart.save();

        return res.status(200).json({ message: "Item added to cart", cart });

    } catch (error) {
        return res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
});

/*router.post('/enroll', verify, enrollmentController.enroll);

router.get('/get-enrollments', verify, enrollmentController.getEnrollments);

router.put('/update-status', verify, verifyAdmin, enrollmentController.updateEnrollmentStatus);
*/
module.exports = router;
