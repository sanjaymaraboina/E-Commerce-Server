const Product = require("../models/product");


exports.createProduct = async (req, res) => {
  const {
    productname,
    category,
    description,
    Price,
    imageUrl,
    admin,
  } = req.body;

  try {
    const newProduct = new Product({
      productname,
      category,
      description,
      Price,
      imageUrl,
      admin,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product Created Successfully", product: newProduct }); 
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error while creating Product: ${error.message}` }); 
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { admin } = req.query;

    let products;
    if (admin) {
      products = await Product.find({ admin: admin });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving Products", error });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" }); 
    }
    res.status(200).json(product); 
  } catch (error) {
    res.status(500).send({ message: "Error retrieving Product", error }); 
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  if (updateData.imageUrl && typeof updateData.imageUrl === 'string') {
    updateData.imageUrl = updateData.imageUrl.split(",").map((url) => url.trim());
  }

  try {
    const updateProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", product: updateProduct });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error while updating Product: ${error.message}` });
  }
};



exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error while deleting product: ${error.message}` });
  }
};

