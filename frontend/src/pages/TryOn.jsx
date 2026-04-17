import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TryOn.css';

const BACKEND = 'http://localhost:5000';

// A local bundled full-body demo photo (in /public folder)
const DEMO_PHOTO_URL = '/test-person.jpg';

export default function TryOn() {
  const [uploadedImage, setUploadedImage] = useState(null);   // base64 preview
  const [uploadedFile, setUploadedFile] = useState(null);     // actual File object
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [tryOnResult, setTryOnResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const location = useLocation();

  // Fetch actual products from the shop
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/products`);
        const data = await res.json();
        const items = data.products || data || [];
        // Filter to wearable clothing (not shoes/accessories)
        const wearable = items.filter(p =>
          ['shirt', 'dress', 'jacket', 'jeans', 'casual', 'formal', 'sports', 'other'].includes(p.category)
        );
        setProducts(wearable);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle pre-selected product from ProductCard navigation
  useEffect(() => {
    if (location.state?.preselectedProduct && products.length > 0) {
      const pre = location.state.preselectedProduct;
      const found = products.find(p => p._id === pre._id);
      if (found) setSelectedProduct(found);
    }
  }, [location.state, products]);

  // Auto-select first product when products load
  useEffect(() => {
    if (products.length > 0 && !selectedProduct && !location.state?.preselectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load a demo photo from local public folder (no CORS issues)
  const loadDemoPhoto = async () => {
    try {
      setError('');
      const res = await fetch(DEMO_PHOTO_URL);
      if (!res.ok) throw new Error('Not found');
      const blob = await res.blob();
      const demoFile = new File([blob], 'demo-photo.jpg', { type: 'image/jpeg' });
      handleFile(demoFile);
    } catch (err) {
      setError('Could not load demo photo. Please upload your own photo.');
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // Fill white for transparency if any
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPG
        canvas.toBlob((blob) => {
          const jpgFile = new File([blob], 'user-photo.jpg', { type: 'image/jpeg' });
          setUploadedFile(jpgFile);
          setUploadedImage(canvas.toDataURL('image/jpeg'));
        }, 'image/jpeg', 0.95);
      };
      img.onerror = () => {
        setError('Failed to process image. Please try a standard JPG/PNG.');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    setError('');
    setTryOnResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleTryOn = async () => {
    if (!uploadedFile) { setError('Please upload a photo of yourself first.'); return; }
    if (!selectedProduct) { setError('Please select a clothing item from the list.'); return; }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', uploadedFile);

      // Send the garment image URL so backend can fetch it
      const garmentUrl = selectedProduct.image.startsWith('http')
        ? selectedProduct.image
        : `${BACKEND}${selectedProduct.image}`;
      formData.append('garmentImageUrl', garmentUrl);
      formData.append('garmentDescription', `${selectedProduct.name}, ${selectedProduct.category} clothing`);

      const res = await fetch(`${BACKEND}/api/tryon`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        setTryOnResult({
          image: `${BACKEND}${data.imageUrl}?t=${Date.now()}`,
          productName: selectedProduct.name,
          product: selectedProduct
        });
      } else {
        setError(data.message || 'Try-on failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Make sure the backend server is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i._id === selectedProduct._id);
    if (existing) { existing.quantity += 1; }
    else { cart.push({ ...selectedProduct, quantity: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${selectedProduct.name} added to cart!`);
  };

  const getCategoryEmoji = (cat) => {
    const map = { jeans: '👖', shirt: '👔', dress: '👗', jacket: '🧥', casual: '👕', formal: '🎩', sports: '⛹️', other: '👗' };
    return map[cat] || '👗';
  };

  return (
    <div className="try-on-page">
      <div className="try-on-hero">
        <h1>👗 Virtual Try-On</h1>
        <p>Upload your photo and see how our clothes look on you — powered by AI</p>
      </div>

      <div className="try-on-container">
        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="try-on-grid">
          {/* ── STEP 1: Upload Photo ── */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-num">1</span>
              <h2>Upload Your Photo</h2>
            </div>
            <div
              className={`drop-zone ${dragOver ? 'drag-active' : ''} ${uploadedImage ? 'has-image' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <img src={uploadedImage} alt="Preview" className="preview-image" />
              ) : (
                <div className="drop-placeholder">
                  <div className="drop-icon">📷</div>
                  <p className="drop-title">Drag & Drop your photo here</p>
                  <p className="drop-sub">or click to browse</p>
                  <p className="drop-hint">JPG, PNG, WEBP · Max 10MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="demo-photo-row">
              {uploadedImage ? (
                <button className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>
                  📷 Change Photo
                </button>
              ) : (
                <button className="demo-photo-btn" onClick={loadDemoPhoto}>
                  🧑 Use Demo Photo
                </button>
              )}
            </div>
            <div className="step-tip">
              💡 <strong>Tip:</strong> Use a clear, well-lit frontal photo for best results
            </div>
          </div>

          {/* ── STEP 2: Select Garment ── */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-num">2</span>
              <h2>Select Clothing</h2>
            </div>

            {loadingProducts ? (
              <div className="loading-products">
                <div className="mini-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No products found. Make sure the backend is running and products are seeded.</p>
              </div>
            ) : (
              <div className="product-picker">
                {products.map(product => (
                  <button
                    key={product._id}
                    className={`product-pick-card ${selectedProduct?._id === product._id ? 'selected' : ''}`}
                    onClick={() => { setSelectedProduct(product); setTryOnResult(null); setError(''); }}
                  >
                    <div className="pick-image-wrap">
                      {product.image ? (
                        <img
                          src={product.image.startsWith('http') ? product.image : `${BACKEND}${product.image}`}
                          alt={product.name}
                          className="pick-product-img"
                          onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                      ) : null}
                      <div className="pick-emoji-fallback" style={{ display: product.image ? 'none' : 'flex' }}>
                        {getCategoryEmoji(product.category)}
                      </div>
                      {selectedProduct?._id === product._id && (
                        <div className="pick-selected-badge">✓</div>
                      )}
                    </div>
                    <p className="pick-name">{product.name}</p>
                    <p className="pick-price">₹{product.price}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── STEP 3: Try On ── */}
          <div className="step-card step-action">
            <div className="step-header">
              <span className="step-num">3</span>
              <h2>Generate Try-On</h2>
            </div>

            <div className="selected-summary">
              {uploadedImage ? (
                <div className="summary-item done">✅ Photo uploaded</div>
              ) : (
                <div className="summary-item pending">⬜ No photo yet</div>
              )}
              {selectedProduct ? (
                <div className="summary-item done">✅ {selectedProduct.name}</div>
              ) : (
                <div className="summary-item pending">⬜ No clothing selected</div>
              )}
            </div>

            {loading ? (
              <div className="ai-loading">
                <div className="ai-spinner"></div>
                <p className="ai-loading-text">AI is generating your try-on…</p>
                <p className="ai-loading-sub">This takes 30–90 seconds on first run</p>
              </div>
            ) : (
              <button
                className="tryon-btn"
                onClick={handleTryOn}
                disabled={!uploadedImage || !selectedProduct}
              >
                ✨ Try On Now
              </button>
            )}

            <div className="step-tip">
              💡 First request wakes the AI model (~60s). After that, each try-on takes ~30s.
            </div>
          </div>
        </div>

        {/* ── RESULT ── */}
        {tryOnResult && (
          <div className="result-section">
            <h2 className="result-title">🎉 Your Virtual Try-On Result</h2>
            <div className="result-content">
              <div className="result-compare">
                <div className="compare-panel">
                  <p className="compare-label">Your Photo</p>
                  <img src={uploadedImage} alt="You" className="compare-img" />
                </div>
                <div className="compare-arrow">→</div>
                <div className="compare-panel">
                  <p className="compare-label">With {tryOnResult.productName}</p>
                  <img src={tryOnResult.image} alt="Try-on result" className="compare-img" />
                </div>
              </div>
              <div className="result-actions">
                <button className="btn-cart" onClick={handleAddToCart}>
                  🛒 Add to Cart — ₹{tryOnResult.product?.price}
                </button>
                <button className="btn-retry" onClick={() => { setTryOnResult(null); setSelectedProduct(null); }}>
                  🔄 Try Another Outfit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="how-it-works">
          <h3>How Virtual Try-On Works</h3>
          <div className="how-steps">
            <div className="how-step">
              <span className="how-icon">📷</span>
              <p>Upload a clear frontal photo of yourself</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <span className="how-icon">👗</span>
              <p>Pick any clothing item from our shop</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <span className="how-icon">🤖</span>
              <p>AI realistically places the outfit on your photo</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <span className="how-icon">🛒</span>
              <p>Like it? Add to cart and buy!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
