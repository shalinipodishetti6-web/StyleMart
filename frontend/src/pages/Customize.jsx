import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Customize.css';

export default function Customize() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');
  const [placeholderProduct, setPlaceholderProduct] = useState(null);

  const makeFallbackImage = (text) => {
    const safeText = String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .slice(0, 120);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a4a94" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ff8c00" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="#f5f5f5"/>
  <rect x="80" y="80" width="1040" height="640" rx="24" fill="url(#g)" opacity="0.15"/>
  <rect x="120" y="120" width="960" height="560" rx="20" fill="#ffffff" stroke="#e5e5e5"/>
  <text x="600" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="#0a4a94" font-weight="700">
    Custom Design Preview
  </text>
  <text x="600" y="400" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#333">
    ${safeText || 'Your prompt'}
  </text>
  <text x="600" y="480" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#666">
    AI generation unavailable — using fallback
  </text>
</svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  useEffect(() => {
    // We need a valid MongoDB Product `_id` for checkout/order creation.
    // Pick the best available "generic" product (category `other` preferred).
    const pickPlaceholder = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        const products = data.products || data || [];

        const isCustomLike = (s) =>
          String(s || '').toLowerCase().includes('custom');

        const otherProducts = products.filter((p) => String(p.category).toLowerCase() === 'other');
        const customCandidate = otherProducts.find(
          (p) => isCustomLike(p.name) || isCustomLike(p.description)
        );

        setPlaceholderProduct(customCandidate || otherProducts[0] || products[0] || null);
      } catch (e) {
        // If this fails, Add to Cart will show an actionable error.
        console.error('Failed to load placeholder product:', e);
        setPlaceholderProduct(null);
      }
    };

    pickPlaceholder();
  }, []);

  const examplePrompts = [
    'Red summer dress with floral patterns',
    'Black leather jacket with zippers',
    'Blue denim jeans with embroidery',
    'White casual t-shirt with minimalist design',
    'Purple hoodie with geometric patterns'
  ];

  const handleGenerateDesign = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design description');
      return;
    }

    // Show an instant local preview so the page "works" even if the AI model is slow/unavailable.
    setError('');
    setGeneratedImage(makeFallbackImage(prompt.trim()));

    try {
      setLoading(true);
      
      // Send design prompt to backend
      const res = await fetch('http://localhost:5000/api/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim()
        })
      });

      if (!res.ok) {
        // Try to show backend error details (token missing, warming up, etc.)
        let data = null;
        try {
          data = await res.json();
        } catch (_) {}
        throw new Error(data?.message || 'Design generation failed');
      }

      const data = await res.json();
      
      if (data.success && data.imageUrl) {
        // Set the generated image URL from backend
        setGeneratedImage(`http://localhost:5000${data.imageUrl}`);

        // If backend had to use fallback, show it so it’s obvious.
        if (data.usedFallback) {
          setError(data.message || 'AI model unavailable; using fallback preview.');
        } else {
          setError('');
        }
      } else {
        setError(data.message || 'Failed to generate design. Please try again.');
      }
    } catch (err) {
      // Try to surface backend error message (token missing, warming up, etc.)
      const msg =
        err?.message ||
        'Failed to generate design. Please try again.';
      setError(msg);
      // Keep the page functional even if AI image generation fails.
      // This allows the user to still add something to cart and place an order.
      setGeneratedImage(makeFallbackImage(prompt));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePrompt = (text) => {
    setPrompt(text);
  };

  const handleAddToCart = () => {
    if (!generatedImage) return;

    if (!placeholderProduct) {
      setError('Could not load a placeholder product for checkout. Please refresh and try again.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Store a unique cart line item `_id` (for quantity/removal),
    // while mapping `productId` to a real MongoDB Product `_id` for checkout.
    const cartItemId = `custom_design_${Date.now()}`;
    const cartItemName = `Custom Design: ${prompt.trim().slice(0, 28)}${prompt.trim().length > 28 ? '…' : ''}`;

    cart.push({
      _id: cartItemId,
      productId: placeholderProduct._id,
      name: cartItemName,
      price: 999,
      quantity: 1,
      image: generatedImage,
      category: 'other'
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  return (
    <div className="customize-page">
      <div className="customize-container">
        <h1>AI Design Customization</h1>
        <p className="subtitle">Describe your dream design and let AI create it for you!</p>

        {error && <div className="error-message">{error}</div>}

        <div className="customize-content">
          {/* Design Input Section */}
          <div className="input-section">
            <h2>Describe Your Design</h2>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Red summer dress with floral patterns and a flowing skirt..."
              className="design-input"
              rows="5"
            />

            <button
              className="generate-btn"
              onClick={handleGenerateDesign}
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '✨ Generate Design'}
            </button>

            <div className="quick-prompts">
              <p>Quick Examples:</p>
              <div className="prompts-list">
                {examplePrompts.map((ex, idx) => (
                  <button
                    key={idx}
                    className="prompt-btn"
                    onClick={() => handleExamplePrompt(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <h2>Design Preview</h2>
            
            {loading ? (
              <div className="preview-loading">
                <div className="spinner"></div>
                <p>Generating your AI design...</p>
              </div>
            ) : !generatedImage ? (
              <div className="preview-placeholder">
                <span className="preview-icon">👗</span>
                <p>Your AI-generated design will appear here</p>
              </div>
            ) : (
              <div className="preview-box">
                <img src={generatedImage} alt="Generated Design" className="generated-image" />
                <div className="preview-actions">
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    🛒 Add to Cart (₹999)
                  </button>
                  <button className="regenerate-btn" onClick={() => {setGeneratedImage(null); setPrompt('');}}>
                    ✨ Generate Another Design
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <h3>Unlimited Designs</h3>
            <p>Create as many custom designs as you want</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Instant Generation</h3>
            <p>Get your design in seconds</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📦</span>
            <h3>Made to Order</h3>
            <p>We'll manufacture and deliver to you</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💯</span>
            <h3>Quality Guaranteed</h3>
            <p>Premium materials and printing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
