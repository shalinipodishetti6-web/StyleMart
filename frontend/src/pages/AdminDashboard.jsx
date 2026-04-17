import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'jeans',
    description: '',
    stock: ''
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.description || !formData.stock) {
      setError('Please fill all fields');
      return;
    }

    if (!editingProduct && !image) {
      setError('Please select an image for new product');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stock', formData.stock);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/admin/products/${editingProduct._id}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        alert('Product updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/products',
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        alert('Product added successfully');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock
    });
    setActiveTab('add');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'jeans',
      description: '',
      stock: ''
    });
    setImage(null);
    setEditingProduct(null);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); resetForm(); }}
          >
            📦 View Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => { setActiveTab('add'); resetForm(); }}
          >
            ➕ {editingProduct ? 'Edit Product' : 'Add Product'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="admin-products">
            <h2>All Products</h2>
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products found</div>
            ) : (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td className="product-name-cell">
                          <img
                            src={product.image
                              ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)
                              : '/placeholder.jpg'}
                            alt={product.name}
                          />
                          <span>{product.name}</span>
                        </td>
                        <td>{product.category}</td>
                        <td>₹{product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Tab */}
        {activeTab === 'add' && (
          <div className="admin-form-section">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleFormChange}>
                    <option value="jeans">Jeans</option>
                    <option value="shirt">Shirt</option>
                    <option value="dress">Dress</option>
                    <option value="jacket">Jacket</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Product Image {!editingProduct && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
