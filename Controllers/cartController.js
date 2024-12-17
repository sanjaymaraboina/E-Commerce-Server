const Cart = require('../models/cart');




exports.addProduct = async (req, res) => {
  const { isapply, productId, userid } = req.body;

  try {
    const existingCartItem = await Cart.findOne({ userid, productId });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return res.status(200).json({ message: "Quantity increased", existingCartItem });
    } else {
      const newCart = new Cart({ isapply, productId, userid, quantity: 1 });
      await newCart.save();
      return res.status(201).json({ message: "Added to cart successfully", newCart });
    }
  } catch (error) {
    res.status(500).send({ message: `Error while adding product to cart: ${error.message}` });
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params; 
  try {
    
    const result = await Cart.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' }); 
    }
    res.status(200).json({ message: 'Product removed from cart' }); 
  } catch (error) {
    res.status(500).json({ message: `Error deleting product: ${error.message}` }); 
  }
};



exports.getApplication = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).send('User ID is required');
    }

    const cartItems = await Cart.find({ userid })
      .populate({
        path: 'productId',  
        select: 'productname category description Price imageUrl' 
      })
      .populate({
        path: 'userid',  
        select: 'fullname email' 
      });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).send('No products found');
    }

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).send({ message: `Error retrieving products: ${error.message}` });
  }
};



exports.deleteApplication = async (req, res) => {
  const { id } = req.params; 

  try {
    const application = await Cart.findByIdAndDelete(id); 

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting application: ${error.message}` });
  }
};



exports.updateQuantity = async (req, res) => {
  const { id } = req.params; 
  const { quantity } = req.body;

  try {
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updatedCartItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Quantity updated successfully", updatedCartItem });
  } catch (error) {
    res.status(500).json({ message: `Error updating quantity: ${error.message}` });
  }
};


exports.clearCart = async (req, res) => {
  try {
    const { userid } = req.query;

    await Cart.deleteMany({ userId: userid });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};