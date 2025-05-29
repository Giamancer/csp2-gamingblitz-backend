//[Section] Dependency
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id is Required']
    },
    productsOrdered: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Product ID is required']
            ref: 'Product',
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required']
        },
        subtotal: {
            type: Number,
            required: [true, 'Total number is required']
        }
    }],
    totalPrice: {
        type: Number,
        required: [true, 'Price is Required']
    },
    orderedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);