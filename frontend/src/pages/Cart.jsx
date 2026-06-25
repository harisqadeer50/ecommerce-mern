import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/index";

const Cart = () => {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500 mb-4">Please login to view your cart</p>
      <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">Login</Link>
    </div>
  );

  if (!cart.items || cart.items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500 mb-4">Your cart is empty</p>
      <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">Continue Shopping</Link>
    </div>
  );

  const subtotal = cart.totalPrice || 0;
  const shipping = 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Cart" }]} />
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Shopping Cart ({cart.items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="bg-white border border-gray-200 rounded-md p-4 flex gap-4">
                <img
                  src={product.images?.[0] || "https://placehold.co/80x80?text=P"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Link to={`/product/${product._id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                      {product.name}
                    </Link>
                    <button onClick={() => removeItem(product._id)} className="text-gray-400 hover:text-red-500 transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Unit price: <span className="text-gray-800 font-medium">${item.price?.toFixed(2)}</span></p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 ? updateItem(product._id, item.quantity - 1) : removeItem(product._id)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(product._id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <Link to="/products" className="text-sm text-blue-600 hover:underline">← Continue Shopping</Link>
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <Trash2 size={14} /> Clear cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-md p-5 sticky top-24">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span className="text-blue-600 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 text-sm rounded transition-colors">Apply</button>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-medium transition-colors"
            >
              Checkout (${total.toFixed(2)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
