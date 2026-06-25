import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], totalPrice: 0 });
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await api.addToCart({ productId, quantity });
      setCart(data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await api.updateCartItem(productId, { quantity });
      setCart(data);
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.removeFromCart(productId);
      setCart(data);
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      throw err;
    }
  };

  const cartCount = cart.items.reduce((a, i) => a + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, clearCart, cartCount, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
