import Product from '../models/Product.js';

// Add product (admin only)
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '/placeholder.jpg';

    const product = new Product({
      name,
      price,
      category,
      description,
      stock,
      image
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, stock } = req.body;

    const updateData = { name, price, category, description, stock, updatedAt: Date.now() };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products for admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
