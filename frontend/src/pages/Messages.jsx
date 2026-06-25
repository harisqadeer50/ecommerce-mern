import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package, Truck, CheckCircle2, XCircle, Clock, Bell,
} from "lucide-react";
import { getMyOrders } from "../services/api";
import { Loader, Breadcrumb } from "../components/ui/index";

// Maps an order status to display info for the notification feed.
const STATUS_META = {
  pending: {
    icon: Clock,
    color: "text-yellow-600 bg-yellow-50",
    title: "Order placed",
    message: (o) => `We received your order for ${o.items.length} item${o.items.length > 1 ? "s" : ""} and it's being confirmed.`,
  },
  processing: {
    icon: Package,
    color: "text-blue-600 bg-blue-50",
    title: "Order is being prepared",
    message: () => "Your order is being packed and will ship soon.",
  },
  shipped: {
    icon: Truck,
    color: "text-purple-600 bg-purple-50",
    title: "Order shipped",
    message: () => "Your order is on its way.",
  },
  delivered: {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50",
    title: "Order delivered",
    message: () => "Your order has been delivered. Enjoy!",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-600 bg-red-50",
    title: "Order cancelled",
    message: () => "This order was cancelled.",
  },
};

const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

const Messages = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load your notifications right now.");
    } finally {
      setLoading(false);
    }
  };

  // Most recently updated orders first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: "Messages" },
      ]} />

      <div className="mb-6 flex items-center gap-3">
        <div className="bg-blue-50 p-2.5 rounded-md">
          <Bell size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <p className="text-sm text-gray-500">Updates about your orders</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-white rounded-md border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No notifications yet. Order updates will show up here.</p>
          <Link to="/products" className="mt-3 inline-block text-blue-600 text-sm hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-100">
          {sortedOrders.map((order) => {
            const meta = STATUS_META[order.status] || STATUS_META.pending;
            const Icon = meta.icon;
            const firstItem = order.items?.[0];

            return (
              <Link
                key={order._id}
                to="/orders"
                className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${meta.color}`}>
                  <Icon size={18} />
                </div>

                {firstItem?.image && (
                  <img
                    src={firstItem.image}
                    alt={firstItem.name}
                    className="w-10 h-10 rounded-md object-contain bg-gray-50 border border-gray-100 flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800">{meta.title}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(order.updatedAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{meta.message(order)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Order #{order._id.slice(-8).toUpperCase()} • ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
