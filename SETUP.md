# StyleMart Setup Instructions

## Quick Start Guide

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with:
MONGODB_URI=mongodb://localhost:27017/stylemart
JWT_SECRET=YOUR_SECRET_KEY_HERE
PORT=5000
NODE_ENV=development

# Start backend server
npm start
```

Backend will run on: `http://localhost:5000`

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

Frontend will automatically open at: `http://localhost:3000`

### 3. Sample Products (For Testing)

Use the Admin Panel to add products:

**Admin Credentials:**
- Email: admin@stylemart.com  
- Password: admin123

Or add via MongoDB directly:

```javascript
db.products.insertMany([
  {
    name: "Blue Denim Jeans",
    price: 999,
    category: "jeans",
    description: "Comfortable blue denim jeans for everyday wear",
    stock: 50,
    image: "https://via.placeholder.com/300x400?text=Blue+Jeans"
  },
  {
    name: "White T-Shirt",
    price: 399,
    category: "shirt",
    description: "Classic white t-shirt made from premium cotton",
    stock: 100,
    image: "https://via.placeholder.com/300x400?text=White+Shirt"
  },
  {
    name: "Summer Dress",
    price: 1299,
    category: "dress",
    description: "Beautiful summer dress perfect for parties",
    stock: 30,
    image: "https://via.placeholder.com/300x400?text=Summer+Dress"
  }
])
```

## Testing Workflow

1. **Register** a new account or login with demo credentials
2. **Browse** products in the Shop section
3. **Search** for products (e.g., search "jeans")
4. **Add to Cart** and proceed to checkout
5. **Fill Order Details** (all validations will be checked)
6. **Place Order** and view it in "My Orders"
7. **Try Admin Panel** to add/edit products

## File Tree

```
StyleMart/
├── backend/
│   ├── models/          (Database schemas)
│   ├── routes/          (API routes)
│   ├── controllers/      (Business logic)
│   ├── middleware/       (Auth, validation, upload)
│   ├── uploads/         (Product images folder)
│   ├── server.js        (Main server file)
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/   (Navbar, ProductCard)
    │   ├── pages/        (All page components)
    │   ├── styles/       (CSS files)
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Available Routes

### Frontend Routes
- `/` - Home page
- `/shop` - Products list
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/login` - Login page
- `/register` - Registration page
- `/admin` - Admin dashboard
- `/tryOn` - Virtual try-on
- `/customize` - AI design customization

### API Routes
- `GET/POST /api/products` - Products
- `GET/POST/PUT/DELETE /api/admin/products` - Admin products
- `POST /api/auth/register|login` - Authentication
- `POST/GET /api/orders` - Orders

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB is running & .env is correct |
| Frontend can't connect | Verify backend is on port 5000 |
| Images not uploading | Check `uploads/` folder exists with permissions |
| Login fails | Verify user exists in MongoDB |
| Cart not saving | Check localStorage is enabled in browser |

## Features Checklist

- ✅ Product Search & Filter
- ✅ User Authentication (JWT)
- ✅ Shopping Cart
- ✅ Order Management
- ✅ Order Validation
- ✅ Admin Panel
- ✅ Product Upload
- ✅ Virtual Try-On
- ✅ AI Customize
- ✅ Responsive Design
- ✅ Professional UI

## Next Steps

1. Test all features
2. Add real payment integration
3. Set up production database
4. Deploy to cloud
5. Add email notifications
6. Integrate real AI models

---

**Happy coding! 🚀**
