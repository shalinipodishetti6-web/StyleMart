import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error('Failed to fetch product details', err);
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ Product added to cart!');
  };

  const handleTryOn = () => {
    navigate('/tryOn', { state: { preselectedProduct: product } });
  };

  const isTryOnEligible = product && ['shirt', 'dress', 'jacket', 'jeans', 'casual', 'formal', 'sports', 'other'].includes(product.category);

  if (loading) return <div className="details-loading">Loading details...</div>;
  if (error) return <div className="details-error">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Shop</button>
      
      <div className="product-details-content">
        <div className="product-image-section">
          {product.image ? (
            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="product-main-image" />
          ) : (
            <div className="image-placeholder">No Image Available</div>
          )}
        </div>

        <div className="product-info-section">
          <div className="badges">
            <span className="category-badge">{product.category}</span>
            {product.stock > 0 ? (
              <span className="stock-badge in-stock">In Stock ({product.stock})</span>
            ) : (
              <span className="stock-badge out-stock">Out of Stock</span>
            )}
          </div>

          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.round(product.rating || 4.5))}</span>
            <span className="rating-score">{product.rating || 4.5} / 5</span>
          </div>

          <h2 className="product-price">₹{product.price}</h2>
          
          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <button className="add-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
              🛒 Add to Cart
            </button>
            {isTryOnEligible && (
              <button className="try-on-btn" onClick={handleTryOn}>
                ✨ Virtual Try-On
              </button>
            )}
          </div>

          <div className="delivery-info">
            <p>🚚 Free standard delivery on orders above ₹999</p>
            <p>↩️ Easy 30-day returns and exchanges</p>
          </div>
        </div>
      </div>
    </div>
  );
}
