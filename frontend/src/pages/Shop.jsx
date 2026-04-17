import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import './Shop.css';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchParams] = useSearchParams();

  const categories = ['all', 'jeans', 'shirt', 'dress', 'jacket', 'shoes', 'accessories', 'formal', 'casual', 'kids', 'sports'];

  useEffect(() => {
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

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    const query = searchParams.get('search');
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchParams]);

  if (loading) {
    return (
      <div className="shop-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Shop</h1>
        <p>Discover our exclusive collection of clothing & accessories</p>
      </div>

      <div className="shop-container">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="products-section">
          {error && <div className="error-message">{error}</div>}

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found</p>
              <p className="no-products-text">Try adjusting your filters or search</p>
            </div>
          ) : (
            <>
              <div className="products-count">
                Showing {filteredProducts.length} products
              </div>
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
