import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { PrivateRoute, AdminRoute } from "./routes/ProtectedRoutes";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Login, Register } from "./pages/Auth";
import { Profile, Orders } from "./pages/ProfileOrders";
import Admin from "./pages/Admin";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import GiftBundles from "./pages/GiftBundles";
import Messages from "./pages/Messages";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Auth pages — no layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* All other pages — with layout */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/faq" element={<Layout><FAQ /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/gift-bundles" element={<Layout><GiftBundles /></Layout>} />

              {/* Protected routes */}
              <Route path="/checkout" element={
                <PrivateRoute><Layout><Checkout /></Layout></PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute><Layout><Profile /></Layout></PrivateRoute>
              } />
              <Route path="/orders" element={
                <PrivateRoute><Layout><Orders /></Layout></PrivateRoute>
              } />
              <Route path="/messages" element={
                <PrivateRoute><Layout><Messages /></Layout></PrivateRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <AdminRoute><Layout><Admin /></Layout></AdminRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <Layout>
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
                    <p className="text-gray-500 mb-4">Page not found</p>
                    <a href="/" className="text-blue-600 hover:underline">Go home</a>
                  </div>
                </Layout>
              } />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
