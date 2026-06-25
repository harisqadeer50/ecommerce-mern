import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { createOrder } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/index";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    street: "", city: "", country: "", zipCode: "", paymentMethod: "COD",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder({
        shippingAddress: { street: form.street, city: form.city, country: form.country, zipCode: form.zipCode },
        paymentMethod: form.paymentMethod,
      });
      setSuccess(true);
      await clearCart();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">Order Placed!</h2>
      <p className="text-gray-500 text-sm mb-6">Thank you for your order. We'll send you a confirmation shortly.</p>
      <button onClick={() => navigate("/orders")} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors mr-3">
        View Orders
      </button>
      <button onClick={() => navigate("/")} className="border border-gray-300 text-gray-600 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
        Continue Shopping
      </button>
    </div>
  );

  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Cart", path: "/cart" }, { label: "Checkout" }]} />
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Street Address", name: "street", full: true },
                  { label: "City", name: "city" },
                  { label: "Country", name: "country" },
                  { label: "Zip Code", name: "zipCode" },
                ].map(({ label, name, full }) => (
                  <div key={name} className={full ? "sm:col-span-2" : ""}>
                    <label className="text-xs text-gray-600 font-medium mb-1 block">{label}</label>
                    <input
                      type="text"
                      name={name}
                      required
                      value={form[name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Payment Method</h2>
              {[
                { value: "COD", label: "Cash on Delivery" },
                { value: "card", label: "Credit / Debit Card (Coming Soon)" },
                { value: "paypal", label: "PayPal (Coming Soon)" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={form.paymentMethod === value}
                    onChange={handleChange}
                    disabled={value !== "COD"}
                    className="accent-blue-600"
                  />
                  <span className={`text-sm ${value !== "COD" ? "text-gray-400" : "text-gray-700"}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-md p-5 h-fit sticky top-24">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.items?.map((item) => (
                <div key={item._id} className="flex justify-between text-xs text-gray-600">
                  <span className="line-clamp-1 flex-1 mr-2">{item.product?.name} x{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Placing Order..." : `Place Order ($${total.toFixed(2)})`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
