# MERN eCommerce Marketplace

Full-stack eCommerce app built with MongoDB, Express, React, Node.js and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
```
Create `.env` file (copy from `.env.example`):
```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.mongodb.net/ecommerce
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Layout.jsx
    │   │   │   ├── TopHeader.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   └── ui/
    │   │       ├── index.jsx      (StarRating, Badge, Loader, Breadcrumb, Pagination)
    │   │       └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── WishlistContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Auth.jsx           (Login + Register)
    │   │   ├── ProfileOrders.jsx  (Profile + Orders)
    │   │   └── Admin.jsx
    │   ├── routes/
    │   │   └── ProtectedRoutes.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Private |
| PUT | /api/auth/profile | Private |
| PUT | /api/auth/wishlist/:productId | Private |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/products | Public |
| GET | /api/products/featured | Public |
| GET | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |
| POST | /api/products/:id/reviews | Private |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/cart | Private |
| POST | /api/cart | Private |
| PUT | /api/cart/:productId | Private |
| DELETE | /api/cart/:productId | Private |
| DELETE | /api/cart/clear | Private |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders | Private |
| GET | /api/orders/myorders | Private |
| GET | /api/orders/:id | Private |
| GET | /api/orders | Admin |
| PUT | /api/orders/:id | Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/admin/stats | Admin |
| GET | /api/admin/users | Admin |
| DELETE | /api/admin/users/:id | Admin |
| PUT | /api/admin/users/:id/role | Admin |

---

## 🧭 Pages

| Page | Route | Access |
|------|-------|--------|
| Home | / | Public |
| Products | /products | Public |
| Product Detail | /product/:id | Public |
| Cart | /cart | Public |
| Checkout | /checkout | Private |
| Login | /login | Public |
| Register | /register | Public |
| Profile | /profile | Private |
| My Orders | /orders | Private |
| Admin | /admin | Admin only |

---

## 🌐 Deploy

### Frontend → Vercel
1. Push frontend to GitHub
2. Import to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Backend → Render
1. Push backend to GitHub
2. New Web Service on Render
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from `.env`

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com
2. Add IP `0.0.0.0/0` to network access
3. Copy connection string to `MONGO_URI`

---

## ✨ Features

- JWT Authentication with role-based access
- Full product CRUD with admin dashboard
- Cart with persistent storage in MongoDB
- Wishlist functionality
- Orders with status tracking
- Product reviews and ratings
- Advanced filtering: brand, price, rating, category
- Grid / List view toggle
- Responsive for mobile, tablet, desktop
- Poppins font with local file support
