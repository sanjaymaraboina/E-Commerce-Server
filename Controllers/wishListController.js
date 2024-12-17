const Wish = require('../models/wishList'); 

exports.addWishList = async (req, res) => {
  const { isAdd, productId, userid } = req.body;

  try {
    const newWishList = new Wish({ isAdd, productId, userid });
    await newWishList.save();
    res.status(201).json({ message: "Added to wishlist successfully" });
  } catch (error) {
    res.status(500).send({ message: `Error while adding product to wishlist: ${error.message}` });
  }
};

exports.getWishList = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).send('User ID is required');
    }

    const wishListItems = await Wish.find({ userid })
      .populate({
        path: 'productId',
        select: 'productname category description Price imageUrl',
      })
      .populate({
        path: 'userid',
        select: 'fullname email',
      });

    if (!wishListItems || wishListItems.length === 0) {
      return res.status(404).send('No products found');
    }

    res.status(200).json(wishListItems);
  } catch (error) {
    res.status(500).send({ message: `Error retrieving wishlist: ${error.message}` });
  }
};

exports.deleteWishList = async (req, res) => {
  const { id } = req.params;

  try {
    const wishListItem = await Wish.findByIdAndDelete(id);

    if (!wishListItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.status(200).json({ message: "Wishlist item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting wishlist item: ${error.message}` });
  }
};
