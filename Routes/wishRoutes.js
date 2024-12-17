const express = require('express');
const router = express.Router();
const { addProduct, getApplication} = require('../Controllers/cartController');
const { deleteApplication,deleteWishList ,getWishList,addWishList} = require("../Controllers/wishListController"); 




router.post('/wishAdd/:id', addWishList);

router.get('/wishListItems', getWishList);

router.delete('/wishListItems/:id', deleteWishList);


module.exports = router;
