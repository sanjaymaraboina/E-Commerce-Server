const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema({
    checkoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkout",
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    }, 
    status: {
        type: String,
    required: true, 
    },
    orderId: {
        type: String, 
        required: true,
    }
}, {
    timestamp: true
});

const PaymentOrder = mongoose.model('payment_orders', paymentOrderSchema);
module.exports = PaymentOrder;