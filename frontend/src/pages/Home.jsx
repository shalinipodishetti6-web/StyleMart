import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to StyleMart</h1>
          <p>Discover the latest fashion trends with our exclusive collection</p>
          <Link to="/shop" className="hero-btn">Shop Now</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/shop?category=jeans" className="category-card">
            <div className="category-icon">👖</div>
            <h3>Jeans</h3>
          </Link>
          <Link to="/shop?category=shirt" className="category-card">
            <div className="category-icon">👔</div>
            <h3>Shirts</h3>
          </Link>
          <Link to="/shop?category=dress" className="category-card">
            <div className="category-icon">👗</div>
            <h3>Dresses</h3>
          </Link>
          <Link to="/shop?category=jacket" className="category-card">
            <div className="category-icon">🧥</div>
            <h3>Jackets</h3>
          </Link>
          <Link to="/shop?category=shoes" className="category-card">
            <div className="category-icon">👞</div>
            <h3>Shoes</h3>
          </Link>
          <Link to="/shop?category=accessories" className="category-card">
            <div className="category-icon">👜</div>
            <h3>Accessories</h3>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="feature-card">
          <span className="feature-icon">🚚</span>
          <h3>Free Shipping</h3>
          <p>On orders above ₹500</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💯</span>
          <h3>Quality Assured</h3>
          <p>100% authentic products</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔄</span>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💳</span>
          <h3>Secure Payment</h3>
          <p>Multiple payment options</p>
        </div>
      </section>

      {/* AI Features */}
      <section className="ai-features-section">
        <div className="ai-feature">
          <h3>Virtual Try-On</h3>
          <p>See how clothes look on you before buying</p>
          <Link to="/tryOn" className="ai-feature-btn">Try It Now</Link>
        </div>
        <div className="ai-feature">
          <h3>AI Design Customization</h3>
          <p>Create your own custom clothing design</p>
          <Link to="/customize" className="ai-feature-btn">Customize</Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Get Special Offers & Deals</h2>
        <p>Sign up for our newsletter to receive exclusive discounts</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
