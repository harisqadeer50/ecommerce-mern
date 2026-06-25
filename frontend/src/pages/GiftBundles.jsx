import { useState, useEffect } from "react";
import { Gift, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import { Loader, Breadcrumb } from "../components/ui/index";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Extra discount applied on top of individual product prices when bought as a bundle.
const BUNDLE_DISCOUNT = 0.15; // 15% off the combined price
const BUNDLE_SIZE = 3; // products per bundle — change to 2 if you prefer pairs

const GiftBundles = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ limit: 30, sort: "rating" });
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group flat product list into bundles of BUNDLE_SIZE
  const bundles = [];
  for (let i = 0; i + 1 < products.length; i += BUNDLE_SIZE) {
    const items = products.slice(i, i + BUNDLE_SIZE);
    if (items.length < 2) break; // don't create a "bundle" of 1
    bundles.push(items);
  }

  const bundlePrice = (items) => {
    const combined = items.reduce((sum, p) => sum + p.price, 0);
    return combined * (1 - BUNDLE_DISCOUNT);
  };

  const handleAddBundle = async (items) => {
    if (!user) { navigate("/login"); return; }
    try {
      for (const item of items) {
        await addToCart(item._id, 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: "Gift bundles" },
      ]} />

      <div className="mb-6 flex items-center gap-3">
        <div className="bg-blue-50 p-2.5 rounded-md">
          <Gift size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Gift bundles</h1>
          <p className="text-sm text-gray-500">
            Bundle {BUNDLE_SIZE} items together and save {Math.round(BUNDLE_DISCOUNT * 100)}% off the combined price.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : bundles.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">Not enough products available to build a bundle right now.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundles.map((items, idx) => {
            const original = items.reduce((sum, p) => sum + p.price, 0);
            const discounted = bundlePrice(items);
            return (
              <div key={idx} className="bg-white rounded-md border border-gray-200 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Bundle of {items.length}
                  </span>
                  <span className="text-xs font-semibold text-red-500">
                    Save {Math.round(BUNDLE_DISCOUNT * 100)}%
                  </span>
                </div>

                {/* Mini product grid inside the bundle card */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {items.map((p) => (
                    <Link key={p._id} to={`/product/${p._id}`} className="block">
                      <div className="aspect-square rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={p.images?.[0] || "https://placehold.co/120x120?text=Product"}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </Link>
                  ))}
                </div>

                <ul className="text-xs text-gray-600 mb-3 flex flex-col gap-1">
                  {items.map((p) => (
                    <li key={p._id} className="line-clamp-1">• {p.name}</li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-semibold text-gray-800">${discounted.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through">${original.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleAddBundle(items)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart size={13} />
                    Add bundle to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GiftBundles;
