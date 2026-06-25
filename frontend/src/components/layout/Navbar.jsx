import { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/api";

const SHIP_OPTIONS = [
  { country: "Germany",        flag: "/images/flags/GERMANY.png" },
  { country: "Pakistan",       flag: "/images/flags/UAE.png" },
  { country: "United States",  flag: "/images/flags/USA.png" },
  { country: "United Kingdom", flag: "/images/flags/UK.png" },
  { country: "France",         flag: "/images/flags/FRANCE.png" },
  { country: "Italy",          flag: "/images/flags/ITALY.png" },
  { country: "China",          flag: "/images/flags/CHINA.png" },
  { country: "Russia",         flag: "/images/flags/RU.png" },
  { country: "Australia",      flag: "/images/flags/AU.png" },
];

const Navbar = () => {
  const [helpOpen,       setHelpOpen]       = useState(false);
  const [shipOpen,       setShipOpen]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories,     setCategories]     = useState([]);
  const [selectedShip,   setSelectedShip]   = useState(SHIP_OPTIONS[0]);

  const shipRef = useRef(null);
  const helpRef = useRef(null);

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (shipRef.current && !shipRef.current.contains(e.target)) setShipOpen(false);
      if (helpRef.current && !helpRef.current.contains(e.target)) setHelpOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) { console.error(err); }
  };

  const navLinks = [
    { label: "Hot offers", path: "/products?sort=featured" },
    { label: "Gift boxes", path: "/gift-bundles" },
    { label: "Projects",   path: "/products" },
  ];

  return (
    <div className="bg-gray-100 border-b border-gray-200 w-full">

      {/* MOBILE TOGGLE */}
      <div className="flex md:hidden items-center px-4 py-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP ROW */}
      <div className="hidden md:block px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">

            {/* All Category */}
            <div className="relative group">
              <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 transition-colors">
                <Menu size={20} />
                <span className="text-sm">All category</span>
              </button>
              <div className="absolute top-full left-0 pt-2 w-52 z-50 hidden group-hover:block">
                <div className="bg-white shadow-lg rounded-md border border-gray-100 max-h-72 overflow-y-auto">
                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-400">No categories found</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="w-px h-5 bg-gray-300" />

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Help */}
            <div className="relative" ref={helpRef}>
              <button
                onClick={() => setHelpOpen(!helpOpen)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Help <ChevronDown size={14} />
              </button>
              {helpOpen && (
                <div className="absolute top-8 left-0 bg-white shadow-lg rounded-md w-40 z-50 border border-gray-100">
                  <Link to="/faq"     className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">FAQ</Link>
                  <Link to="/contact" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Contact us</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <select className="bg-transparent text-sm text-gray-600 outline-none cursor-pointer">
              <option>English, USD</option>
              <option>Urdu, PKR</option>
              <option>Arabic, AED</option>
            </select>

            {/* Ship to — flag dropdown */}
            <div className="relative" ref={shipRef}>
              <button
                onClick={() => setShipOpen(!shipOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <img
                  src={selectedShip.flag}
                  alt={selectedShip.country}
                  className="w-5 h-3.5 object-cover rounded-sm"
                />
                <span>Ship to {selectedShip.country}</span>
                <ChevronDown size={14} />
              </button>

              {shipOpen && (
                <div className="absolute top-8 right-0 bg-white shadow-lg rounded-md w-48 z-50 border border-gray-100 max-h-64 overflow-y-auto">
                  {SHIP_OPTIONS.map((opt) => (
                    <button
                      key={opt.country}
                      onClick={() => { setSelectedShip(opt); setShipOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                        selectedShip.country === opt.country ? "bg-blue-50 text-blue-600" : "text-gray-600"
                      }`}
                    >
                      <img
                        src={opt.flag}
                        alt={opt.country}
                        className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                      />
                      {opt.country}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 flex flex-col gap-1 shadow-md max-h-[80vh] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Categories</p>
          {categories.length === 0 ? (
            <p className="py-2 text-sm text-gray-400">No categories found</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm text-gray-600 hover:text-blue-600 border-b border-gray-100 transition-colors"
              >
                {cat.name}
              </Link>
            ))
          )}

          <p className="text-xs font-semibold text-gray-400 uppercase mt-3 mb-1">Menu</p>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm text-gray-600 hover:text-blue-600 border-b border-gray-100"
            >
              {link.label}
            </Link>
          ))}

          <div className="py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-1">Help</p>
            <div className="flex flex-col gap-1 pl-2">
              <Link to="/faq"     onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-500 hover:text-blue-600">FAQ</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-500 hover:text-blue-600">Contact us</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <select className="bg-transparent text-sm text-gray-600 outline-none cursor-pointer">
              <option>English, USD</option>
              <option>Urdu, PKR</option>
            </select>
            <div className="flex items-center gap-2">
              <img
                src={selectedShip.flag}
                alt={selectedShip.country}
                className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0"
              />
              <select
                className="bg-transparent text-sm text-gray-600 outline-none cursor-pointer flex-1"
                value={selectedShip.country}
                onChange={(e) => setSelectedShip(SHIP_OPTIONS.find((o) => o.country === e.target.value))}
              >
                {SHIP_OPTIONS.map((o) => (
                  <option key={o.country} value={o.country}>Ship to {o.country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
