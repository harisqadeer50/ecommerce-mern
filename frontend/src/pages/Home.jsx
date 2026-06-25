import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { getFeaturedProducts, getCategories, getProducts } from "../services/api";
import ProductCard from "../components/ui/ProductCard";
import { Loader } from "../components/ui/index";
import { useAuth } from "../context/AuthContext";

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
};

const TimeBox = ({ value, label }) => (
  <div className="bg-gray-800 text-white text-center px-2 py-1 rounded min-w-10">
    <div className="text-lg font-bold leading-none">{String(value || 0).padStart(2, "0")}</div>
    <div className="text-xs opacity-70">{label}</div>
  </div>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeProducts, setHomeProducts] = useState([]);
  const [techProducts, setTechProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState({ item: "", details: "", quantity: "" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const timeLeft = useCountdown(new Date(Date.now() + 4 * 86400000 + 13 * 3600000));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, recRes, catRes, homeRes, techRes] = await Promise.all([
          getFeaturedProducts(),
          getProducts({ limit: 10 }),
          getCategories(),
          getProducts({ category: "Home & Garden", limit: 8 }),
          getProducts({ category: "Electronics", limit: 8 }),
        ]);
        setFeatured(featRes.data);
        setRecommended(recRes.data.products);
        setCategories(catRes.data);
        setHomeProducts(homeRes.data.products || []);
        setTechProducts(techRes.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Each item has a label and the category it maps to
  const sideCategories = [
    { label: "Mobile Phones",      category: "Electronics"   },
    { label: "Clothes and wear",   category: "Clothing"      },
    { label: "Home interiors",     category: "Home & Garden" },
    { label: "Computer and tech",  category: "Electronics"   },
    { label: "Tools, equipments",  category: "Home & Garden" },
    { label: "Sports and outdoor", category: "Clothing"      },
    { label: "Books and Novels",    category: "Books"         },
    { label: "Machinery tools",    category: "Electronics"   },
    { label: "More category",      category: ""              },
  ];

  const services = [
    { img: "/images/boxes.png",      label: "Source from Industry Hubs", sub: "Find trusted suppliers" },
    { img: "/images/customize.png",  label: "Customize Your Products",   sub: "Your design, your brand" },
    { img: "/images/airplane.png",   label: "Fast, reliable shipping",   sub: "By ocean or air" },
    { img: "/images/monitoring.png", label: "Product monitoring",        sub: "And inspection" },
  ];

  const suppliers = [
    { flag: "/images/flags/UAE.png",    country: "Arabic Emirates", domain: "shopname.ae" },
    { flag: "/images/flags/AU.png",     country: "Australia",       domain: "shopname.au" },
    { flag: "/images/flags/USA.png",    country: "United States",   domain: "shopname.us" },
    { flag: "/images/flags/RU.png",     country: "Russia",          domain: "shopname.ru" },
    { flag: "/images/flags/ITALY.png",  country: "Italy",           domain: "shopname.it" },
    { flag: "/images/flags/FRANCE.png", country: "France",          domain: "shopname.fr" },
    { flag: "/images/flags/UAE.png",    country: "Arabic Emirates", domain: "shopname.ae" },
    { flag: "/images/flags/CHINA.png",  country: "China",           domain: "shopname.cn" },
    { flag: "/images/flags/UK.png",     country: "Great Britain",   domain: "shopname.uk" },
  ];

  const categorySections = [
    {
      title: "Home and outdoor",
      color: "bg-amber-50",
      category: "Home & Garden",
      products: homeProducts,
      fallbackItems: [
        { name: "Soft chairs",    price: 19,  icon: "🪑" },
        { name: "Sofa & chair",   price: 19,  icon: "🛋️" },
        { name: "Kitchen dishes", price: 19,  icon: "🍽️" },
        { name: "Smart watches",  price: 19,  icon: "⌚" },
        { name: "Kitchen mixer",  price: 100, icon: "🫙" },
        { name: "Blenders",       price: 39,  icon: "🥤" },
        { name: "Home appliance", price: 19,  icon: "🏠" },
        { name: "Coffee maker",   price: 10,  icon: "☕" },
      ],
    },
    {
      title: "Consumer electronics and gadgets",
      color: "bg-blue-50",
      category: "Electronics",
      products: techProducts,
      fallbackItems: [
        { name: "Smart watches",   price: 19,  icon: "⌚" },
        { name: "Cameras",         price: 89,  icon: "📷" },
        { name: "Headphones",      price: 70,  icon: "🎧" },
        { name: "Laptops",         price: 90,  icon: "💻" },
        { name: "Gaming set",      price: 35,  icon: "🎮" },
        { name: "Laptops & PC",    price: 340, icon: "💻" },
        { name: "Smartphones",     price: 19,  icon: "📱" },
        { name: "Electric kettle", price: 240, icon: "⚡" },
      ],
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

      {/* ── HERO SECTION ── */}
      <div className="flex gap-3 mb-8">

        {/* Left Category Sidebar */}
        <div className="hidden lg:block bg-white rounded-md border border-gray-200 w-48 flex-shrink-0 py-2">
          {sideCategories.map((cat, i) => (
            <Link
              key={i}
              to={cat.category ? `/products?category=${encodeURIComponent(cat.category)}` : "/products"}
              className={`block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${i === 0 ? "bg-blue-50 text-blue-600" : ""}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Hero Banner */}
        <div className="flex-1 bg-gradient-to-r from-cyan-100 to-teal-200 rounded-md p-8 flex items-center relative overflow-hidden min-h-52">
          <div className="z-10">
            <p className="text-gray-600 text-sm mb-1">Latest trending</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Electronic items</h1>
            <Link
              to="/products?category=Electronics"
              className="bg-white text-gray-800 px-5 py-2 rounded-md text-sm font-medium hover:shadow-md transition-shadow"
            >
              Learn more
            </Link>
          </div>
          <img
            src="/images/hero-banner.png"
            alt="Hero"
            className="absolute right-0 top-0 h-full w-full object-cover opacity-90"
          />
        </div>

        {/* Right Auth Card */}
        <div className="hidden md:flex flex-col gap-3 w-44 flex-shrink-0">
          {user ? (
            <div className="bg-white rounded-md border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">Hi, {user.name.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500">Welcome back</p>
                </div>
              </div>
              <Link to="/profile" className="w-full bg-blue-600 text-white text-xs py-2 rounded text-center block hover:bg-blue-700 transition-colors">
                My Profile
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-md border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-xs font-medium text-gray-800">Hi, user</p>
                  <p className="text-xs text-gray-500">let's get started</p>
                </div>
              </div>
              <Link to="/register" className="w-full bg-blue-600 text-white text-xs py-2 rounded text-center block mb-2 hover:bg-blue-700 transition-colors">
                Join now
              </Link>
              <Link to="/login" className="w-full border border-blue-600 text-blue-600 text-xs py-2 rounded text-center block hover:bg-blue-50 transition-colors">
                Log in
              </Link>
            </div>
          )}
          <div className="bg-orange-400 rounded-md p-3 text-white text-xs">
            <p className="font-semibold mb-1">Get US $10 off with a new supplier</p>
          </div>
          <div className="bg-teal-400 rounded-md p-3 text-white text-xs">
            <p className="font-semibold">Send quotes with supplier preferences</p>
          </div>
        </div>
      </div>

      {/* ── DEALS & OFFERS ── */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Deals and offers</h2>
            <p className="text-xs text-gray-500">Hygiene equipments</p>
          </div>
          <div className="flex items-center gap-2">
            <TimeBox value={timeLeft.days} label="Days" />
            <TimeBox value={timeLeft.hours} label="Hour" />
            <TimeBox value={timeLeft.mins} label="Min" />
            <TimeBox value={timeLeft.secs} label="Sec" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {techProducts.slice(0, 5).map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border border-gray-200 rounded-md p-3 text-center hover:border-blue-400 transition-colors"
            >
              <div className="w-full h-20 flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-700 font-medium mb-1 line-clamp-1">{product.name}</p>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                -{product.discount || 10}%
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CATEGORY SECTIONS ── */}
      {categorySections.map((section) => (
        <div key={section.title} className="bg-white rounded-md border border-gray-200 mb-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className={`${section.color} p-6 flex flex-col justify-center`}>
              <h2 className="text-base font-bold text-gray-800 mb-3">{section.title}</h2>
              <Link
                to={`/products?category=${section.category}`}
                className="bg-white border border-gray-300 text-gray-700 text-xs px-4 py-2 rounded hover:shadow-sm transition-shadow w-fit"
              >
                Source now
              </Link>
            </div>
            <div className="col-span-4 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-gray-100">
              {section.products.length > 0
                ? section.products.slice(0, 8).map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-full h-16 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-gray-700 font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">From <span className="text-blue-600 font-medium">${product.price.toFixed(0)}</span></p>
                    </Link>
                  ))
                : section.fallbackItems.map((item) => (
                    <Link
                      key={item.name}
                      to={`/products?keyword=${item.name}`}
                      className="p-4 flex flex-col gap-1 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <p className="text-xs text-gray-700 font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">From USD {item.price}</p>
                    </Link>
                  ))
              }
            </div>
          </div>
        </div>
      ))}

      {/* ── SEND QUOTE BANNER ── */}
      <div className="rounded-md overflow-hidden mb-6 relative">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 md:p-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="text-white flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-2">An easy way to send requests to all suppliers</h2>
            <p className="text-sm text-blue-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
          </div>
          <div className="bg-white rounded-md p-5 w-full md:w-80 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Send quote to suppliers</h3>
            <p className="text-xs text-gray-500 mb-3">What item you need?</p>
            <input
              placeholder="What item you need?"
              value={inquiry.item}
              onChange={(e) => setInquiry({ ...inquiry, item: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-2 focus:border-blue-400"
            />
            <textarea
              placeholder="Type more details"
              value={inquiry.details}
              onChange={(e) => setInquiry({ ...inquiry, details: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-2 focus:border-blue-400 resize-none"
            />
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Quantity"
                value={inquiry.quantity}
                onChange={(e) => setInquiry({ ...inquiry, quantity: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <select className="border border-gray-300 rounded px-3 py-2 text-sm outline-none">
                <option>Pcs</option>
                <option>Kg</option>
                <option>Boxes</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-colors flex items-center justify-center gap-2">
              <Send size={14} />
              Send inquiry
            </button>
          </div>
        </div>
      </div>

      {/* ── RECOMMENDED ITEMS ── */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recommended items</h2>
        {recommended.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {recommended.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">No products yet. Add some from the admin panel.</p>
            <Link to="/products" className="text-blue-600 text-sm hover:underline mt-2 block">Browse products</Link>
          </div>
        )}
      </div>

      {/* ── EXTRA SERVICES ── */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Our extra services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {services.map((service) => (
            <div key={service.label} className="bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-36 overflow-hidden bg-gray-50">
                <img
                  src={service.img}
                  alt={service.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800">{service.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{service.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUPPLIERS BY REGION ── */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Suppliers by region</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {suppliers.map((s, i) => (
            <div key={i} className="bg-white rounded-md border border-gray-200 p-3 flex items-center gap-3 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
              <img
                src={s.flag}
                alt={s.country}
                className="w-10 h-7 object-cover rounded shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{s.country}</p>
                <p className="text-xs text-gray-400 truncate">{s.domain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      

    </div>
  );
};

export default Home;
