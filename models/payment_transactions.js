const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: String,
        default: null,
    },
    paymentId: {
        type: String,
        default: null,
    },
    checkoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkout',
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
    
},
    {
        timestamps: true
    });
    const PaymentTransaction = mongoose.model('payment_transaction', transactionSchema );
    module.exports = PaymentTransaction;