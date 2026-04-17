import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      const products = await Product.find();
      return res.json({ success: true, products });
    }

    // Search in name, description, and category (case-insensitive)
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category.toLowerCase() });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get trending products (sorted by rating)
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ rating: -1 })
      .limit(10);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
