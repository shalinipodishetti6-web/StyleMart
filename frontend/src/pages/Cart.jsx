import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart to get started</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>

            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="product-details">
                  <img
                    src={item.image
                      ? (item.image.startsWith('http') || item.image.startsWith('data:')
                        ? item.image
                        : `http://localhost:5000${item.image}`)
                      : '/placeholder.jpg'}
                    alt={item.name}
                  />
                  <div className="product-info">
                    <h3>{item.name}</h3>
                    <p className="product-category">{item.category}</p>
                  </div>
                </div>
                <span className="price">₹{item.price}</span>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  />
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <span className="total">₹{item.price * item.quantity}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>₹{Math.round(totalPrice * 0.18)}</span>
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>₹{Math.round(totalPrice + totalPrice * 0.18)}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <button 
              className="continue-shopping-link"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </button>

            <button 
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
