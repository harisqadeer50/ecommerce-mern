import { createContext, useContext, useState } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = async (productId) => {
    if (!user) return;
    try {
      const { data } = await api.toggleWishlist(productId);
      setWishlist(data.wishlist);
    } catch (err) {
      console.error(err);
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
