const Checkout = require('../models/checkout');
const CartItem = require('../models/cart'); 
const product = require('../models/product'); 

const createCheckout = async (req, res) => {
  try {
    const { userId, cartItems, shippingAddress, totalAmount } = req.body;

    const cart = await CartItem.find({ 'userid' : userId });
    console.log(cart)
    if (cart.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    const checkout = new Checkout({
      userId,
      cartItems,
      shippingAddress,
      totalAmount,
      product,
    });

    await checkout.save();
    res.status(201).json({ message: 'Checkout created successfully', checkout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCheckout };
