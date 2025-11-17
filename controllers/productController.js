const Product = require('../models/Product');
const { rawListeners } = require('../server');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const id = req.query?.sort;
    const products = await Product.find().sort((id === "asc") ? { _id: 1 } : { _id: -1 }); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};