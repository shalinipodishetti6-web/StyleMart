import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import axios from 'axios';

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'creditCard'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedAddress = formData.address.trim();

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!trimmedAddress) newErrors.address = 'Address is required';
    if (trimmedAddress.length < 10) newErrors.address = 'Address must be at least 10 characters';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setError('Please fill all required fields correctly');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        setError('Your cart is empty');
        return;
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderData = {
        items: cart.map(item => ({
          // Normal products use `_id`, but custom design cart items may use a
          // unique `_id` with a separate `productId` that maps to MongoDB.
          productId: item.productId || item._id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount,
        shippingDetails: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        localStorage.removeItem('cart');
        navigate('/order-confirmation', { 
          state: { 
            order: {
              ...orderData,
              orderId: response.data.order._id
            }
          }
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = Math.round(totalAmount * 0.08);
  const finalTotal = totalAmount + taxAmount;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {error && <div className="error-banner">{error}</div>}

        <div className="checkout-content">
          {/* Shipping Form */}
          <div className="checkout-form-section">
            <h2>Shipping Details</h2>
            
            <form className="checkout-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter complete address (min 10 characters)"
                  rows="3"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              {/* City & State */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                    placeholder="Enter city"
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                    placeholder="Enter state"
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'error' : ''}
                  placeholder="Enter 6-digit pincode"
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>

              <h2 style={{ marginTop: '30px' }}>Payment Method</h2>

              {/* Payment */}
              <div className="payment-methods">
                {['creditCard', 'debitCard', 'netBanking', 'upi', 'cod'].map(method => (
                  <div key={method} className="payment-option">
                    <input
                      type="radio"
                      id={method}
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                    />
                    <label htmlFor={method}>
                      {method === 'creditCard' && 'Credit Card'}
                      {method === 'debitCard' && 'Debit Card'}
                      {method === 'netBanking' && 'Net Banking'}
                      {method === 'upi' && 'UPI'}
                      {method === 'cod' && 'Cash on Delivery'}
                    </label>
                  </div>
                ))}
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-mini"></span>
                    Processing...
                  </>
                ) : (
                  '✓ Place Order'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cart.map(item => (
                <div key={item._id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>₹{taxAmount}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Payable</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
