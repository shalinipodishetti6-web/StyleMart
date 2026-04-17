import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const BACKEND = 'http://localhost:5000';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) { existingItem.quantity += 1; }
    else { cart.push({ ...product, quantity: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  const handleTryOn = (e) => {
    e.stopPropagation();
    // Navigate to Try-On page with this product pre-selected via state
    navigate('/tryOn', { state: { preselectedProduct: product } });
  };

  const getFallbackImage = () => {
    const categoryEmoji = {
      jeans: '👖', shirt: '👔', dress: '👗', jacket: '🧥',
      shoes: '👞', accessories: '👜', formal: '🎩',
      casual: '👕', kids: '👶', sports: '⛹️'
    };
    return categoryEmoji[product.category] || '👗';
  };

  const isTryOnEligible = ['shirt','dress','jacket','jeans','casual','formal','sports','other'].includes(product.category);

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="product-image">
        {!imageError && product.image ? (
          <img
            src={product.image.startsWith('http') ? product.image : `${BACKEND}${product.image}`}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{ display: 'block' }}
          />
        ) : (
          <div className="image-fallback">
            <span className="fallback-emoji">{getFallbackImage()}</span>
            <p className="fallback-text">{product.category}</p>
          </div>
        )}
        <div className="product-overlay">
          <button className="view-details-btn">View Details</button>
        </div>
        {isTryOnEligible && (
          <button className="try-on-badge" onClick={handleTryOn} title="Virtual Try-On">
            👗 Try On
          </button>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">
          <span className="category-badge">{product.category}</span>
        </p>
        <p className="product-description">
          {product.description.substring(0, 60)}...
        </p>
        <div className="product-rating">
          <span className="stars">★★★★☆</span>
          <span className="rating-value">{product.rating || 4.5}</span>
        </div>
        <div className="product-bottom">
          <div className="product-price">
            <span className="price">₹{product.price}</span>
            {product.stock > 0 && <span className="stock-info">In Stock</span>}
            {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
