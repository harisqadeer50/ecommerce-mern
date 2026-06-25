import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-md p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <Link to="/" className="flex items-center gap-2 justify-center mb-4">
            <div className="bg-blue-600 text-white p-2 rounded-md"><ShoppingCart size={20} /></div>
            <span className="text-blue-600 text-xl font-bold">Brand</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4 border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-blue-400 pr-10"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-blue-600" /> Remember me
            </label>
            <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState("");
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setFormError("Passwords do not match"); return; }
    setFormError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-md p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <Link to="/" className="flex items-center gap-2 justify-center mb-4">
            <div className="bg-blue-600 text-white p-2 rounded-md"><ShoppingCart size={20} /></div>
            <span className="text-blue-600 text-xl font-bold">Brand</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Join us today</p>
        </div>

        {(error || formError) && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4 border border-red-200">
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "Your full name" },
            { label: "Email address", name: "email", type: "email", placeholder: "Your email" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
              <input
                type={type}
                required
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                placeholder={placeholder}
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-blue-400 pr-10"
                placeholder="Create a password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
