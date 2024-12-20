const express = require('express');
const { createPaymentOrder, capture } = require("../Controllers/paymentController");
const router = express.Router();




router.post('/create-order', createPaymentOrder);
router.post('/capture-payment',capture)

module.exports = router;
