# StyleMart - Mini E-Commerce Platform with AI Virtual Try-On

A professional, full-stack e-commerce platform for clothing shopping built with React, Node.js, Express, and MongoDB.

## Features

### 1. Product Management
- ✅ Product search and filtering by category
- ✅ Advanced product display with ratings
- ✅ Admin panel for CRUD operations
- ✅ Image upload with Multer
- ✅ Stock management

### 2. Shopping Experience
- ✅ Shopping cart with quantity management
- ✅ Product filtering and sorting
- ✅ Responsive product cards
- ✅ Quick view and add to cart

### 3. User Management
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Secure password hashing with bcryptjs
- ✅ Role-based access (User/Admin)
- ✅ User profile management

### 4. Order Management
- ✅ Complete checkout process
- ✅ Order validation with detailed error messages
- ✅ Order history and tracking
- ✅ Order status updates
- ✅ Payment method selection

### 5. Admin Panel
- ✅ Product CRUD operations
- ✅ Inventory management
- ✅ Product image upload
- ✅ Order management

### 6. AI Features
- ✅ Virtual Try-On interface
- ✅ Custom clothing design generator
- ✅ Design preview functionality

### 7. Professional UI
- ✅ Modern, responsive design (like Amazon/Flipkart)
- ✅ Sticky navigation bar
- ✅ Mobile-friendly interface
- ✅ Smooth animations and transitions
- ✅ Professional color scheme

## Project Structure

```
StyleMart/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── uploads/       (Product images)
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Navbar.css
    │   │   ├── ProductCard.jsx
    │   │   └── ProductCard.css
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Shop.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Orders.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── TryOn.jsx
    │   │   ├── Customize.jsx
    │   │   └── (CSS files for each page)
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/stylemart
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000
NODE_ENV=development
```

Start MongoDB:
```bash
mongod
```

Start backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will automatically open at `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?query=jeans` - Search products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get product details

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders` - Get all orders (admin only)

### Admin
- `POST /api/admin/products` - Add product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)
- `GET /api/admin/products` - Get all products (admin view)

## Demo Credentials

### Admin Account
- **Email:** admin@stylemart.com
- **Password:** admin123

### Regular User
- Create new account by registering

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling
- **Responsive Design** - Mobile-friendly

## Key Features Explained

### 1. Product Search
- Search across product name, description, and category
- Real-time filtering as you type
- Category-based filtering
- Sorting by price and rating

### 2. Order Validation
- All fields are validated before order placement
- Phone must be 10 digits
- Pincode must be 6 digits
- Address minimum 10 characters
- Detailed error messages for each field

### 3. Shopping Cart
- Persists data in localStorage
- Add/remove items
- Update quantities
- Calculate totals with tax

### 4. Virtual Try-On
- Upload personal photo
- Select clothing item
- View simulated try-on result
- Add custom design to cart

### 5. Admin Panel
- Manage products (add, edit, delete)
- Upload product images
- Manage inventory
- View orders

## Styling

- Modern, professional color scheme
- Responsive grid layouts
- Flexbox for alignment
- Mobile-first approach
- Smooth animations and transitions
- Hover effects for better UX

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Input validation
- CORS protection

## Performance Optimizations

- Lazy loading of images
- Efficient database queries
- Response caching
- Optimized CSS and JavaScript
- Responsive images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

1. Payment gateway integration (Stripe, Razorpay)
2. Real AI model for virtual try-on
3. User reviews and ratings
4. Wishlist functionality
5. Email notifications
6. Advanced analytics dashboard
7. Multi-language support
8. Dark mode
9. Real-time chat support
10. Social media integration

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify MongoDB is installed

### Frontend not connecting to Backend
- Verify backend is running on port 5000
- Check API URLs in axios calls
- Ensure CORS is enabled

### Image Upload Issues
- Check `uploads/` folder exists
- Verify file permissions
- Ensure image file size is under 10MB

## License

This project is open source and available - feel free to use and modify.

## Support

For issues or questions, please refer to the documentation or create an issue.

---

**Built with ❤️ for StyleMart E-Commerce Platform**
