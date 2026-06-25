import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Users, ShoppingBag, DollarSign, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardStats, getAllUsers, deleteUser, getProducts,
  createProduct, updateProduct, deleteProduct, getAllOrders,
  updateOrderStatus, getCategories,
} from "../services/api";
import { Loader } from "../components/ui/index";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-md p-4 flex items-center gap-3">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className="text-lg md:text-xl font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProductList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", stock: "", brand: "",
    category: "", images: "", isFeatured: false, discount: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, ordersRes, catRes] = await Promise.all([
        getDashboardStats(), getAllUsers(),
        getProducts({ limit: 50 }), getAllOrders(), getCategories(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProductList(productsRes.data.products);
      setOrders(ordersRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProductList(products.filter((p) => p._id !== id));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      discount: Number(productForm.discount),
      images: productForm.images.split(",").map((i) => i.trim()).filter(Boolean),
    };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
      } else {
        await createProduct(data);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", stock: "", brand: "", category: "", images: "", isFeatured: false, discount: 0 });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, description: product.description,
      price: product.price, stock: product.stock, brand: product.brand || "",
      category: product.category?._id || "", images: product.images?.join(", ") || "",
      isFeatured: product.isFeatured, discount: product.discount || 0,
    });
    setShowProductForm(true);
  };

  const handleOrderStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    setOrders(orders.map((o) => o._id === id ? { ...o, status } : o));
  };

  const tabs = ["dashboard", "products", "orders", "users"];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

      {/* ── TAB NAV — scrollable on mobile ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-md mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm font-medium capitalize transition-colors whitespace-nowrap flex-shrink-0 ${
              tab === t ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && stats && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard icon={Users}       label="Total Users"    value={stats.totalUsers}                    color="bg-blue-500" />
            <StatCard icon={Package}     label="Total Products" value={stats.totalProducts}                 color="bg-green-500" />
            <StatCard icon={ShoppingBag} label="Total Orders"   value={stats.totalOrders}                   color="bg-purple-500" />
            <StatCard icon={DollarSign}  label="Revenue"        value={`$${stats.totalRevenue?.toFixed(0)}`} color="bg-orange-500" />
          </div>

          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Recent Orders</h2>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400">
                    <th className="text-left py-2 pr-4">Order</th>
                    <th className="text-left py-2 pr-4">Customer</th>
                    <th className="text-left py-2 pr-4">Total</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders?.map((o) => (
                    <tr key={o._id} className="border-b border-gray-50">
                      <td className="py-2 pr-4 font-mono">#{o._id.slice(-6).toUpperCase()}</td>
                      <td className="py-2 pr-4">{o.user?.name}</td>
                      <td className="py-2 pr-4 font-medium">${o.totalPrice?.toFixed(2)}</td>
                      <td className="py-2 capitalize text-blue-600">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-4 gap-3">
            <h2 className="text-sm font-semibold text-gray-800">Products ({products.length})</h2>
            <button
              onClick={() => { setShowProductForm(true); setEditingProduct(null); }}
              className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>

          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="bg-white rounded-t-xl sm:rounded-md w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </h3>
                  <button
                    onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleProductSubmit} className="space-y-3">
                  {[
                    { label: "Product Name", name: "name", type: "text" },
                    { label: "Brand", name: "brand", type: "text" },
                    { label: "Price ($)", name: "price", type: "number" },
                    { label: "Stock", name: "stock", type: "number" },
                    { label: "Discount (%)", name: "discount", type: "number" },
                    { label: "Image URLs (comma separated)", name: "images", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="text-xs text-gray-600 mb-1 block">{label}</label>
                      <input
                        type={type}
                        value={productForm[name]}
                        onChange={(e) => setProductForm({ ...productForm, [name]: e.target.value })}
                        required={["name", "price", "stock"].includes(name)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-blue-600"
                    />
                    Featured Product
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      {editingProduct ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                      className="flex-1 border border-gray-300 text-gray-600 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table — scrollable, cards on mobile */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Product", "Price", "Stock", "Featured", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.images?.[0] || "https://placehold.co/32x32?text=P"}
                            alt=""
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = "https://placehold.co/32x32?text=P"; }}
                          />
                          <span className="font-medium text-gray-700 line-clamp-1 max-w-[140px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">${p.price?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.isFeatured ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-gray-300" />}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile product cards */}
          <div className="sm:hidden space-y-3">
            {products.map((p) => (
              <div key={p._id} className="bg-white border border-gray-200 rounded-md p-3 flex items-center gap-3">
                <img
                  src={p.images?.[0] || "https://placehold.co/48x48?text=P"}
                  alt=""
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = "https://placehold.co/48x48?text=P"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">${p.price?.toFixed(2)} · Stock: {p.stock}</p>
                  {p.isFeatured && <span className="text-xs text-blue-600">Featured</span>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="text-blue-600"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === "orders" && (
        <div>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[560px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Order ID", "Customer", "Total", "Payment", "Status", "Update"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono">#{o._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-gray-600">{o.user?.name}</td>
                      <td className="px-4 py-3 font-medium">${o.totalPrice?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">{o.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span className={`capitalize px-2 py-0.5 rounded-full text-xs ${
                          o.status === "delivered" ? "bg-green-100 text-green-700" :
                          o.status === "cancelled" ? "bg-red-100 text-red-700" :
                          o.status === "shipped"   ? "bg-purple-100 text-purple-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                          className="border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                        >
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile order cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="bg-white border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-gray-800">#{o._id.slice(-6).toUpperCase()}</span>
                  <span className={`capitalize px-2 py-0.5 rounded-full text-xs ${
                    o.status === "delivered" ? "bg-green-100 text-green-700" :
                    o.status === "cancelled" ? "bg-red-100 text-red-700" :
                    o.status === "shipped"   ? "bg-purple-100 text-purple-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{o.status}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{o.user?.name}</p>
                <p className="text-sm font-semibold text-blue-600 mb-3">${o.totalPrice?.toFixed(2)}</p>
                <select
                  value={o.status}
                  onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none"
                >
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === "users" && (
        <div>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-700 truncate max-w-[100px]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {u._id !== user._id && (
                          <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile user cards */}
          <div className="sm:hidden space-y-3">
            {users.map((u) => (
              <div key={u._id} className="bg-white border border-gray-200 rounded-md p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {u.role}
                  </span>
                </div>
                {u._id !== user._id && (
                  <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
