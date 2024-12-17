const express = require('express');
const { createCheckout } = require('../Controllers/checkoutController');
const router = express.Router();

router.post('/checkout', createCheckout);

module.exports = router;
