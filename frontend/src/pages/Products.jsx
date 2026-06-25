import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ui/ProductCard";
import { Loader, Pagination, Breadcrumb } from "../components/ui/index";

const BRANDS = ["Samsung", "Apple", "Huawei", "Pocco", "Lenovo"];
const FEATURES = ["Metallic", "Plastic cover", "8GB Ram", "Super power", "Large Memory"];
const RATINGS = [5, 4, 3, 2];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState("grid");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [selectedRating, setSelectedRating] = useState(null);
  const [sort, setSort] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const categoryParam = searchParams.get("category") || "";

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => { fetchProducts(); }, [keyword, categoryParam, selectedBrands, selectedRating, sort, verifiedOnly, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        keyword, category: categoryParam, page, limit: 9,
        sort, verified: verifiedOnly,
        ...(selectedBrands.length && { brand: selectedBrands.join(",") }),
        ...(selectedRating && { rating: selectedRating }),
        minPrice: priceRange.min, maxPrice: priceRange.max,
      };
      const { data } = await getProducts(params);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
    setPage(1);
  };

  const selectCategory = (catName) => {
    setSearchParams(catName ? { category: catName } : {});
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setPriceRange({ min: 0, max: 999999 });
    setSelectedRating(null);
    setVerifiedOnly(false);
    setPage(1);
    setSearchParams({});
  };

  const FilterSidebar = ({ onClose }) => (
    <div className="w-full">
      {/* Close button — mobile only */}
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Filters</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Category */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Category</h3>
        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => { selectCategory(cat.name); onClose?.(); }}
                className={`text-xs transition-colors text-left w-full ${categoryParam === cat.name ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
          {categoryParam && (
            <li>
              <button onClick={() => selectCategory("")} className="text-xs text-blue-600">
                Clear category
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Brands */}
      <div className="mb-5 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Brands</h3>
        <ul className="space-y-2">
          {BRANDS.map((brand) => (
            <li key={brand} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-blue-600 flex-shrink-0"
              />
              <label htmlFor={`brand-${brand}`} className="text-xs text-gray-600 cursor-pointer">{brand}</label>
            </li>
          ))}
        </ul>
      </div>

      {/* Features */}
      <div className="mb-5 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Features</h3>
        <ul className="space-y-2">
          {FEATURES.map((feat) => (
            <li key={feat} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`feat-${feat}`}
                checked={selectedFeatures.includes(feat)}
                onChange={() => setSelectedFeatures((prev) =>
                  prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
                )}
                className="accent-blue-600 flex-shrink-0"
              />
              <label htmlFor={`feat-${feat}`} className="text-xs text-gray-600 cursor-pointer">{feat}</label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-5 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Price range</h3>
        <input
          type="range"
          min={0}
          max={1000}
          value={priceRange.max === 999999 ? 1000 : priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
          className="w-full accent-blue-600 mb-2"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min || ""}
            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max === 999999 ? "" : priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 999999 })}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none"
          />
        </div>
        <button
          onClick={() => { fetchProducts(); onClose?.(); }}
          className="mt-2 w-full border border-blue-600 text-blue-600 text-xs py-1.5 rounded hover:bg-blue-50 transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Condition */}
      <div className="mb-5 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Condition</h3>
        {["Any", "Refurbished", "Brand new", "Old items"].map((c) => (
          <div key={c} className="flex items-center gap-2 mb-1.5">
            <input type="radio" name="condition" id={`cond-${c}`} className="accent-blue-600 flex-shrink-0" />
            <label htmlFor={`cond-${c}`} className="text-xs text-gray-600 cursor-pointer">{c}</label>
          </div>
        ))}
      </div>

      {/* Ratings */}
      <div className="mb-5 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Ratings</h3>
        {RATINGS.map((r) => (
          <div key={r} className="flex items-center gap-2 mb-1.5">
            <input
              type="checkbox"
              id={`rating-${r}`}
              checked={selectedRating === r}
              onChange={() => { setSelectedRating(selectedRating === r ? null : r); setPage(1); }}
              className="accent-blue-600 flex-shrink-0"
            />
            <label htmlFor={`rating-${r}`} className="text-xs text-gray-600 cursor-pointer">
              {"★".repeat(r)}{"☆".repeat(5 - r)} & up
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={() => { clearFilters(); onClose?.(); }}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2 rounded transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: "All Products", path: "/products" },
        ...(categoryParam ? [{ label: categoryParam }] : keyword ? [{ label: `"${keyword}"` }] : []),
      ]} />

      <div className="flex gap-5">

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="hidden md:block w-52 flex-shrink-0 bg-white rounded-md border border-gray-200 p-4 self-start sticky top-4">
          <FilterSidebar />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">

          {/* Sort / Filter Bar */}
          <div className="bg-white rounded-md border border-gray-200 p-3 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Left: count + verified */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-800">{total.toLocaleString()}</span> items in{" "}
                  <span className="font-semibold text-gray-800">{categoryParam || keyword || "All products"}</span>
                </span>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(1); }}
                    className="accent-blue-600"
                  />
                  Verified only
                </label>
              </div>

              {/* Right: filter btn, sort, view toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="md:hidden flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded text-xs text-gray-600"
                >
                  <SlidersHorizontal size={12} /> Filters
                </button>

                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-600 outline-none"
                >
                  <option value="newest">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>

                {/* Active brand pills */}
                <div className="flex items-center gap-1 flex-wrap">
                  {selectedBrands.map((b) => (
                    <span key={b} className="bg-gray-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {b}
                      <X size={10} className="cursor-pointer" onClick={() => toggleBrand(b)} />
                    </span>
                  ))}
                </div>

                {/* View toggle */}
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-1.5 ${view === "grid" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-1.5 ${view === "list" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid / List */}
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-md border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-sm">No products found. Try different filters.</p>
              <button onClick={clearFilters} className="mt-3 text-blue-600 text-sm hover:underline">
                Clear filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {products.map((p) => <ProductCard key={p._id} product={p} view="grid" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {products.map((p) => <ProductCard key={p._id} product={p} view="list" />)}
            </div>
          )}

          <Pagination
            page={page}
            pages={pages}
            onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
          />
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER (slide-in overlay) ── */}
      {showMobileFilter && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setShowMobileFilter(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-full bg-white shadow-xl p-4 overflow-y-auto md:hidden">
            <FilterSidebar onClose={() => setShowMobileFilter(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
