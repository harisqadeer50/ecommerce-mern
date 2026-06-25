import { useState, useEffect } from "react";
import { User, MessageSquare, ShoppingCart, ClipboardList, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getCategories } from "../../services/api";

const TopHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All category");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("keyword", searchQuery);
    if (category !== "All category") params.set("category", category);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-white px-4 md:px-6 border-b border-gray-200 shadow-sm">

      {/* ── MOBILE ROW ── */}
      <div className="flex md:hidden items-center justify-between py-3">
        {/* Logo — left aligned */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-md">
            <ShoppingCart size={18} />
          </div>
          <span className="text-blue-600 text-xl font-bold">Brand</span>
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileSearch((prev) => !prev)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Search size={22} />
          </button>
          <Link
            to={user ? "/profile" : "/login"}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <User size={22} />
          </Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── MOBILE SEARCH BAR (expands below) ── */}
      {showMobileSearch && (
        <div className="md:hidden pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowMobileSearch(false);
              navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
            }}
            className="flex border border-gray-300 rounded-md overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2 outline-none text-sm text-gray-600"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      )}

      {/* ── DESKTOP ROW ── */}
      <div className="hidden md:flex items-center justify-between gap-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-w-fit">
          <div className="bg-blue-600 text-white p-2 rounded-md">
            <ShoppingCart size={20} />
          </div>
          <span className="text-blue-600 text-2xl font-bold">Cartify</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 outline-none text-sm text-gray-600"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-l border-gray-300 px-3 py-2 text-sm text-gray-600 bg-white outline-none cursor-pointer"
          >
            <option value="All category">All category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
            <User size={22} />
            <span className="text-xs mt-1">{user ? user.name.split(" ")[0] : "Profile"}</span>
          </Link>
          <Link to={user ? "/messages" : "/login"} className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
            <MessageSquare size={22} />
            <span className="text-xs mt-1">Message</span>
          </Link>
          <Link to={user ? "/orders" : "/login"} className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ClipboardList size={22} />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">My cart</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default TopHeader;
