import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Breadcrumb } from "../components/ui/index";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: wire this up to a real endpoint, e.g. API.post("/contact", form)
      await new Promise((res) => setTimeout(res, 700));
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: "Help", path: "/faq" },
        { label: "Contact us" },
      ]} />

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Contact us</h1>
        <p className="text-sm text-gray-500">
          Have a question about an order, a product, or anything else? Send us a message below.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Contact details */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="bg-white rounded-md border border-gray-200 p-4 flex items-start gap-3">
            <Mail size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Email</p>
              <p className="text-xs text-gray-500">support@brand.com</p>
            </div>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-4 flex items-start gap-3">
            <Phone size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Phone</p>
              <p className="text-xs text-gray-500">+1 (555) 010-2024</p>
              <p className="text-xs text-gray-400">Mon-Fri, 9am-6pm</p>
            </div>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-4 flex items-start gap-3">
            <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Office</p>
              <p className="text-xs text-gray-500">123 Market Street, Suite 400</p>
              <p className="text-xs text-gray-500">San Francisco, CA 94103</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-md border border-gray-200 p-5">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <CheckCircle2 size={36} className="text-green-500 mb-3" />
              <h2 className="text-base font-semibold text-gray-800 mb-1">Message sent</h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Thanks for reaching out. We'll get back to you at {form.email} within 1-2 business days.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded transition-colors"
              >
                {submitting ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
