import { Star } from "lucide-react";

export const StarRating = ({ rating, size = 14 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

export const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Loader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span className="text-gray-300">›</span>}
        {item.path ? (
          <a href={item.path} className="hover:text-blue-600 transition-colors">{item.label}</a>
        ) : (
          <span className="text-gray-800 font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-40 hover:border-blue-600 hover:text-blue-600 transition-colors"
      >
        ‹
      </button>
      {[...Array(pages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1.5 border rounded text-sm transition-colors ${
            page === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-40 hover:border-blue-600 hover:text-blue-600 transition-colors"
      >
        ›
      </button>
    </div>
  );
};
