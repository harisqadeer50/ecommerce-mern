import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { StarRating } from "../ui/index";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, view = "grid" }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    toggleWishlist(product._id);
  };

  if (view === "list") {
    return (
      <Link to={`/product/${product._id}`} className="bg-white rounded-md border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow">
        <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || "https://placehold.co/120x120?text=Product"}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800 text-sm">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>
            <button onClick={handleWishlist} className={`p-1.5 rounded-full border ${isWishlisted(product._id) ? "text-red-500 border-red-200" : "text-gray-400 border-gray-200"} hover:border-red-300 transition-colors`}>
              <Heart size={16} className={isWishlisted(product._id) ? "fill-red-500" : ""} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-500">{product.rating?.toFixed(1)}</span>
            <span className="text-xs text-gray-400">• {product.sold} orders</span>
            {product.shipping === "Free shipping" && (
              <span className="text-xs text-green-600 font-medium">• Free Shipping</span>
            )}
          </div>
          <h3 className="text-sm text-gray-700 mt-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          <button onClick={handleAddToCart} className="mt-2 text-xs text-blue-600 hover:underline">
            View details
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product._id}`} className="bg-white rounded-md border border-gray-200 p-3 hover:shadow-md transition-shadow group relative flex flex-col">
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full z-10">
          -{product.discount}%
        </span>
      )}
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 p-1.5 rounded-full border bg-white ${isWishlisted(product._id) ? "text-red-500 border-red-200" : "text-gray-400 border-gray-200"} hover:border-red-300 transition-colors z-10`}
      >
        <Heart size={14} className={isWishlisted(product._id) ? "fill-red-500" : ""} />
      </button>

      {/* Fixed aspect-ratio image box — prevents stretching no matter how wide the card is */}
      <div className="w-full aspect-square rounded-md mb-3 overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={product.images?.[0] || "https://placehold.co/200x200?text=Product"}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <p className="font-semibold text-gray-800 text-sm">${product.price.toFixed(2)}</p>
      {product.originalPrice && (
        <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
      )}
      <div className="flex items-center gap-1 mt-1">
        <StarRating rating={product.rating} size={12} />
        <span className="text-xs text-gray-500">{product.rating?.toFixed(1)}</span>
      </div>
      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.name}</p>
      <button
        onClick={handleAddToCart}
        className="mt-2 w-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1"
      >
        <ShoppingCart size={12} />
        Add to cart
      </button>
    </Link>
  );
};

export default ProductCard;
