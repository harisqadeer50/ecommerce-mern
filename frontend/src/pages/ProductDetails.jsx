import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Shield, Globe, MapPin, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductById, getProducts, createReview } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Loader, Breadcrumb, StarRating } from "../components/ui/index";
import ProductCard from "../components/ui/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [youMayLike, setYouMayLike] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await getProductById(id);
      const productData = data.product || data;
      setProduct(productData);
      if (productData.category) {
        const catName = productData.category?.name || productData.category;
        const { data: relData } = await getProducts({ category: catName, limit: 5 });
        const related = (relData.products || []).filter(p => p._id !== productData._id);
        setYouMayLike(related.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setSubmitting(true);
    try {
      await createReview(id, reviewForm);
      setMessage("Review submitted!");
      fetchProduct();
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const images = product.images?.length > 0
    ? product.images
    : ["https://placehold.co/400x400?text=Product"];

  const specs = product.specifications
    ? Object.entries(product.specifications)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb items={[
        { label: "Home", path: "/" },
        { label: product.category?.name || "Products", path: `/products?category=${product.category?.name || ""}` },
        { label: product.name },
      ]} />

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="bg-white rounded-md border border-gray-200 p-4 md:p-6 mb-6">

        {/* Stack on mobile, 3-col on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">

          {/* ── IMAGE GALLERY ── */}
          <div className="flex flex-col gap-3">
            <div className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center"
              style={{ aspectRatio: "1/1" }}>
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Product"; }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-1"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-1"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-14 h-14 rounded border-2 overflow-hidden ${activeImage === i ? "border-blue-600" : "border-gray-200"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div>
            <span className="flex items-center gap-1 text-green-600 text-xs font-medium mb-2">
              <CheckCircle size={14} />
              {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
            </span>
            <h1 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-gray-700">{product.rating?.toFixed(1)}</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">{product.numReviews} reviews</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">{product.sold} sold</span>
            </div>

            {/* Pricing Tiers */}
            {product.pricingTiers?.length > 0 ? (
              <div className="grid grid-cols-3 border border-gray-200 rounded-md overflow-hidden mb-4">
                {product.pricingTiers.map((tier, i) => (
                  <div key={i} className={`p-2 text-center ${i < product.pricingTiers.length - 1 ? "border-r border-gray-200" : ""}`}>
                    <p className="text-base font-bold text-red-600">${tier.price?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{tier.minQty}-{tier.maxQty || "+"} pcs</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-2xl font-bold text-red-600">${product.price?.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice?.toFixed(2)}</span>
                )}
              </div>
            )}

            {/* Details table */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              {[
                { label: "Price", value: "Negotiable" },
                { label: "Brand", value: product.brand || "General" },
                { label: "Category", value: product.category?.name || "—" },
                { label: "Protection", value: product.protection || "Refund Policy" },
                { label: "Warranty", value: product.warranty || "2 years full warranty" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-24 flex-shrink-0">{label}:</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SELLER CARD ── */}
          <div className="flex flex-col gap-3">
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {product.sellerName?.[0] || "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">Supplier</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{product.sellerName || "Guanjoi Trading LLC"}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                  {product.sellerLocation || "Germany, Berlin"}
                </div>
                {product.isVerified && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield size={12} className="text-green-500 flex-shrink-0" />
                    Verified Seller
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Globe size={12} className="text-blue-500 flex-shrink-0" />
                  {product.shipping || "Worldwide shipping"}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-colors mb-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} />
                {addingToCart ? "Adding..." : "Send inquiry"}
              </button>
              <button className="w-full border border-blue-600 text-blue-600 text-sm py-2 rounded hover:bg-blue-50 transition-colors">
                Seller's profile
              </button>
            </div>

            {/* Save for later */}
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`flex items-center gap-2 text-sm justify-center py-2 border rounded-md transition-colors ${isWishlisted(product._id) ? "text-red-500 border-red-200 bg-red-50" : "text-blue-600 border-blue-200 hover:bg-blue-50"}`}
            >
              <Heart size={14} className={isWishlisted(product._id) ? "fill-red-500" : ""} />
              {isWishlisted(product._id) ? "Saved" : "Save for later"}
            </button>

            {/* Quantity + Add to Cart */}
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-600 mb-2 font-medium">Quantity</p>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-blue-600"
                >
                  -
                </button>
                <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-blue-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-colors disabled:opacity-50"
              >
                {addingToCart ? "Adding..." : "Add to cart"}
              </button>
              {message && <p className="text-xs text-green-600 mt-2 text-center">{message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS + YOU MAY LIKE ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">

        {/* Tabs */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-md border border-gray-200">
            {/* Tab Headers — scrollable on mobile */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {["description", "reviews", "shipping", "about seller"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-5">
              {/* Description */}
              {activeTab === "description" && (
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>
                  {specs.length > 0 && (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
                        <tbody>
                          {specs.map(([key, val], i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="px-4 py-2 text-gray-500 font-medium border-r border-gray-200 w-1/3 whitespace-nowrap">{key}</td>
                              <td className="px-4 py-2 text-gray-700">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {product.features?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Customer Reviews ({product.numReviews})</h3>
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {product.reviews.map((review, i) => (
                        <div key={i} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {review.name?.[0]}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{review.name}</span>
                            <StarRating rating={review.rating} size={12} />
                          </div>
                          <p className="text-xs text-gray-600 ml-9">{review.comment}</p>
                          <p className="text-xs text-gray-400 ml-9 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">No reviews yet. Be the first!</p>
                  )}
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">Write a Review</h4>
                      <div className="flex items-center gap-2 mb-3">
                        {[1,2,3,4,5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`cursor-pointer ${star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none mb-3"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded transition-colors disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                      {message && <p className="text-xs text-green-600 mt-2">{message}</p>}
                    </form>
                  ) : (
                    <p className="text-sm text-gray-500 mt-4">
                      <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to write a review.
                    </p>
                  )}
                </div>
              )}

              {/* Shipping */}
              {activeTab === "shipping" && (
                <div className="text-sm text-gray-600 space-y-3">
                  <p><strong>Shipping:</strong> {product.shipping || "Worldwide shipping available"}</p>
                  <p><strong>Delivery:</strong> 7–14 business days depending on location</p>
                  <p><strong>Returns:</strong> {product.protection || "Refund Policy applies"}</p>
                  <p><strong>Warranty:</strong> {product.warranty || "2 years full warranty"}</p>
                </div>
              )}

              {/* About Seller */}
              {activeTab === "about seller" && (
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {product.sellerName?.[0] || "S"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{product.sellerName || "Guanjoi Trading LLC"}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {product.sellerLocation || "Germany, Berlin"}
                      </p>
                    </div>
                  </div>
                  {product.isVerified && (
                    <p className="flex items-center gap-2"><Shield size={14} className="text-green-500" /> Verified Seller</p>
                  )}
                  <p className="flex items-center gap-2"><Globe size={14} className="text-blue-500" /> {product.shipping || "Ships worldwide"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Like */}
        <div className="bg-white rounded-md border border-gray-200 p-4 h-fit">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">You may like</h3>
          {/* Mobile: horizontal scroll. Desktop: vertical list */}
          <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0 lg:space-y-3">
            {youMayLike.length > 0 ? youMayLike.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="flex-shrink-0 flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors lg:flex-shrink"
              >
                <img
                  src={item.images?.[0] || "https://placehold.co/48x48?text=P"}
                  alt={item.name}
                  className="w-14 h-14 object-contain bg-gray-50 rounded-md flex-shrink-0"
                  onError={(e) => { e.target.src = "https://placehold.co/48x48?text=P"; }}
                />
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">${(item.price * 0.9).toFixed(2)} - ${item.price.toFixed(2)}</p>
                </div>
              </Link>
            )) : (
              <p className="text-xs text-gray-400">No related products found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-blue-600 rounded-md p-5 my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-white">
          <p className="text-base md:text-lg font-bold">Super discount on more than 100 USD</p>
          <p className="text-sm text-blue-200">Have you ever finally just write dummy info</p>
        </div>
        <Link
          to="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
        >
          Shop now
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
