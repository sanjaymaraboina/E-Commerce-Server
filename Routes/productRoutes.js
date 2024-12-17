const express = require("express");
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    
} = require("../Controllers/productController");
const { addProduct } = require("../Controllers/cartController");
const {
  authEmployeeMiddleware,
} = require("../Controllers/userControllers");
const {
  authEmployerMiddleware,
} = require("../Controllers/adminControllers");
const {
  combinedAuthMiddleware,
} = require("../Controllers/combinedMiddileware");
const router = express.Router();

router.post("/products", authEmployerMiddleware, createProduct);
router.get("/products", combinedAuthMiddleware, getAllProducts);
router.get("/products/:id", combinedAuthMiddleware, getProductById);
router.put("/products/:id", authEmployerMiddleware, updateProduct);
router.delete("/products/:id", authEmployerMiddleware, deleteProduct);
module.exports = router;
