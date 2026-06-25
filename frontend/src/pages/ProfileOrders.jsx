import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, LogOut, Edit2, CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/api";
import { Breadcrumb, Loader } from "../components/ui/index";

const statusIcon = { pending: Clock, processing: Clock, shipped: Truck, delivered: CheckCircle, cancelled: XCircle };
const statusColor = { pending: "text-yellow-500", processing: "text-blue-500", shipped: "text-purple-500", delivered: "text-green-500", cancelled: "text-red-500" };
const statusBg = { pending: "bg-yellow-50", processing: "bg-blue-50", shipped: "bg-purple-50", delivered: "bg-green-50", cancelled: "bg-red-50" };

export const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) { navigate("/login"); return null; }

  const handleLogout = () => { logout(); navigate("/"); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: form.name, email: form.email, ...(form.password && { password: form.password }) });
      setMessage("Profile updated!");
      setEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Profile" }]} />

      <div className="bg-white border border-gray-200 rounded-md p-4 md:p-6">

        {/* ── PROFILE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{user.name}</h1>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-green-50 text-green-600 text-sm px-3 py-2 rounded mb-4 border border-green-200">
            {message}
          </div>
        )}

        {/* ── EDIT FORM ── */}
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "New Password (leave blank to keep)", name: "password", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                <input
                  type={type}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
            ))}
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* ── INFO GRID ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="border border-gray-100 rounded-md p-4">
              <p className="text-xs text-gray-400 mb-1">Name</p>
              <p className="text-sm font-medium text-gray-800 break-words">{user.name}</p>
            </div>
            <div className="border border-gray-100 rounded-md p-4">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-800 break-all">{user.email}</p>
            </div>
          </div>
        )}

        {/* ── QUICK LINKS ── */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Package size={16} className="text-blue-600 flex-shrink-0" />
            My Orders
          </Link>
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-md px-4 py-3 text-sm text-purple-700 hover:bg-purple-100 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: "Profile", path: "/profile" },
        { label: "My Orders" },
      ]} />
      <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-10 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-sm mb-4">No orders yet</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const Icon = statusIcon[order.status] || Clock;
            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-md p-4 md:p-5">

                {/* Order header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-mono font-medium text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full flex-shrink-0 ${statusBg[order.status] || "bg-gray-50"}`}>
                    <Icon size={12} className={statusColor[order.status]} />
                    <span className={`text-xs font-medium capitalize ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Product thumbnails */}
                {order.items?.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {order.items.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.image || "https://placehold.co/40x40?text=P"}
                        alt=""
                        className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                        onError={(e) => { e.target.src = "https://placehold.co/40x40?text=P"; }}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs text-gray-400">+{order.items.length - 4} more</span>
                    )}
                  </div>
                )}

                {/* Footer: date + total */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
