import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/orders/user-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setOrders(response.data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <span className="no-orders-icon">📦</span>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet</p>
            <button className="shop-btn" onClick={() => navigate('/shop')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="label">Order ID:</span>
                    <span className="value">{order._id}</span>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.orderStatus}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Tracking Progress */}
                <div className="order-tracking">
                  <h4>Order Tracking</h4>
                  <div className="tracking-progress">
                    <div className={`step ${['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= 0 ? 'active' : ''}`}>
                      <div className="step-circle">📋</div>
                      <p>Order Placed</p>
                    </div>
                    <div className={`connector ${['processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= 0 ? 'active' : ''}`}></div>
                    <div className={`step ${['processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= 0 ? 'active' : ''}`}>
                      <div className="step-circle">⚙️</div>
                      <p>Processing</p>
                    </div>
                    <div className={`connector ${['shipped', 'delivered'].indexOf(order.orderStatus) >= 0 ? 'active' : ''}`}></div>
                    <div className={`step ${['shipped', 'delivered'].indexOf(order.orderStatus) >= 0 ? 'active' : ''}`}>
                      <div className="step-circle">🚚</div>
                      <p>Shipped</p>
                    </div>
                    <div className={`connector ${order.orderStatus === 'delivered' ? 'active' : ''}`}></div>
                    <div className={`step ${order.orderStatus === 'delivered' ? 'active completed' : ''}`}>
                      <div className="step-circle">🎉</div>
                      <p>Delivered</p>
                    </div>
                  </div>
                </div>

                <div className="order-info">
                  <div className="info-item">
                    <span className="label">Order Date:</span>
                    <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Amount:</span>
                    <span className="value amount">₹{order.totalAmount}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Delivery Address:</span>
                    <span className="value">{order.shippingDetails.address}, {order.shippingDetails.city}</span>
                  </div>
                </div>

                <div className="order-items">
                  <h3>Items:</h3>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="item-detail">
                      <span>{item.productName} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="payment-method">Payment: {order.paymentMethod}</span>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
