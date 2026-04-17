import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderData = location.state?.order;
    
    if (!orderData) {
      navigate('/shop');
      return;
    }

    setOrder(orderData);
    setLoading(false);
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="loading">Loading confirmation...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const generateOrderId = () => {
    return `ORD-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  };

  const orderId = generateOrderId();

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase</p>
        </div>

        {/* Order ID & Date */}
        <div className="order-id-section">
          <div className="id-card">
            <label>Order ID</label>
            <div className="order-id-value">{orderId}</div>
            <button 
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(orderId);
                alert('Order ID copied!');
              }}
            >
              📋 Copy Order ID
            </button>
          </div>
          <div className="id-card">
            <label>Order Date</label>
            <div className="date-value">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="id-card">
            <label>Estimated Delivery</label>
            <div className="delivery-value">
              {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          {/* Items */}
          <div className="summary-section">
            <h3>Items Ordered</h3>
            <div className="items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <div className="item-details">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="summary-section">
            <h3>Price Breakdown</h3>
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="breakdown-row">
                <span>Tax (8%)</span>
                <span>₹{Math.round(order.totalAmount * 0.08)}</span>
              </div>
              <div className="breakdown-row total">
                <span>Total Amount</span>
                <span>₹{order.totalAmount + Math.round(order.totalAmount * 0.08)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="summary-section">
            <h3>Delivery Address</h3>
            <div className="shipping-details">
              <p><strong>{order.shippingDetails.fullName}</strong></p>
              <p>{order.shippingDetails.address}</p>
              <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
              <p>Phone: {order.shippingDetails.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="summary-section">
            <h3>Payment Method</h3>
            <p className="payment-method">
              {order.paymentMethod === 'creditCard' && '💳 Credit Card'}
              {order.paymentMethod === 'debitCard' && '💳 Debit Card'}
              {order.paymentMethod === 'netBanking' && '🏦 Net Banking'}
              {order.paymentMethod === 'upi' && '📱 UPI'}
              {order.paymentMethod === 'cod' && '💰 Cash on Delivery'}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h2>What's Next?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Check Your Email</h4>
              <p>We've sent a confirmation email with your order details</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Track Your Order</h4>
              <p>Visit your orders page to track real-time delivery status</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Receive & Enjoy</h4>
              <p>Your package will arrive within 3-5 business days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="track-order-btn"
            onClick={() => navigate('/orders')}
          >
            📦 Track Your Order
          </button>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/shop')}
          >
            🛍️ Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
