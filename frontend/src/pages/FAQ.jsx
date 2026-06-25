import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Breadcrumb } from "../components/ui/index";

const FAQ_SECTIONS = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll get a tracking link by email. You can also see live status anytime from Orders in your account menu.",
      },
      {
        q: "How long does shipping take?",
        a: "Most orders arrive within 3-7 business days domestically, and 7-14 business days for international addresses. Delivery estimates are shown at checkout before you pay.",
      },
      {
        q: "Can I change my shipping address after ordering?",
        a: "If your order hasn't shipped yet, contact us right away and we'll update it. Once it's shipped, we're unable to redirect the package.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        q: "What's your return policy?",
        a: "You can return most items within 30 days of delivery for a full refund, as long as they're unused and in original packaging.",
      },
      {
        q: "How do I start a return?",
        a: "Go to Orders in your account, select the order, and choose Start a return. We'll email you a prepaid shipping label.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are issued within 5-7 business days after we receive your returned item, back to your original payment method.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, along with the regional payment options shown at checkout for your country.",
      },
      {
        q: "Is it safe to enter my card details on this site?",
        a: "Yes. All payments are processed over an encrypted connection, and we never store your full card number on our servers.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        q: "I forgot my password. What do I do?",
        a: "Click Forgot password on the login screen and we'll send you a reset link by email.",
      },
      {
        q: "How do I delete my account?",
        a: "Reach out through our Contact page and we'll take care of it for you within a few business days.",
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-3.5 text-left"
      >
        <span className="text-sm text-gray-800 font-medium">{q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="text-sm text-gray-500 pb-4 leading-relaxed">{a}</p>}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: "Help", path: "/faq" },
        { label: "FAQ" },
      ]} />

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Frequently asked questions</h1>
        <p className="text-sm text-gray-500">
          Can't find what you're looking for? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a> and we'll help.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.title} className="bg-white rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">{section.title}</h2>
            <div>
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
