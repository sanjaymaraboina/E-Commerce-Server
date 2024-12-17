const express = require('express');
const router = express.Router();
const { 
  addProduct, 
  getApplication, 
  deleteApplication, 
  updateQuantity 
} = require('../Controllers/cartController');

const { clearCart } = require("../Controllers/cartController");


router.post('/add/:id', addProduct);
router.post('/cartItems/:id', addProduct);

router.get('/cartItems', getApplication);

router.delete('/cartItems/:id', deleteApplication);

router.patch('/cartItems/:id', updateQuantity);

router.delete("/clearCart", clearCart); 



module.exports = router;
