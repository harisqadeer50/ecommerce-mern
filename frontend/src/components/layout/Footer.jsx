import { ShoppingCart, Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      {/* Newsletter */}
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Subscribe on our newsletter</h3>
          <p className="text-sm text-gray-500 mb-4">Get daily news on upcoming offers from many suppliers all over the world</p>
          <div className="flex max-w-md mx-auto border border-gray-300 rounded-md overflow-hidden">
            <div className="flex items-center px-3 bg-white border-r border-gray-300">
              <span className="text-gray-400 text-sm">✉</span>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-sm text-gray-600 bg-white"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 text-white p-1.5 rounded-md">
                <ShoppingCart size={16} />
              </div>
              <span className="text-blue-600 text-lg font-bold">Brand</span>
            </Link>
            <p className="text-xs text-gray-500 mb-4">Best information about the company goes here but now lorem ipsum is</p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">About</h4>
            <ul className="space-y-2">
              {["About Us", "Find store", "Categories", "Blogs"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Partnership</h4>
            <ul className="space-y-2">
              {["About Us", "Find store", "Categories", "Blogs"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Information</h4>
            <ul className="space-y-2">
              {["Help Center", "Money Refund", "Shipping", "Contact us"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For users */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">For users</h4>
            <ul className="space-y-2">
              {[
                { label: "Login", path: "/login" },
                { label: "Register", path: "/register" },
                { label: "Settings", path: "/profile" },
                { label: "My Orders", path: "/orders" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-xs text-gray-500 hover:text-blue-600 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get app */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Get app</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="bg-black text-white text-xs px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <span className="text-base"></span>
                <div>
                  <div className="text-xs opacity-70">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-black text-white text-xs px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <span className="text-base">▶</span>
                <div>
                  <div className="text-xs opacity-70">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© 2024 Ecommerce. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>🇺🇸</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
