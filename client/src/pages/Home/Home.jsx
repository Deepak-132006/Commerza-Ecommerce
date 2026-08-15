import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import Gadgets from "../../assets/categories/gadgets.jpg";
import Mobiles from "../../assets/categories/mobile.jpg";
import Laptops from "../../assets/categories/laptops.webp";
import Tabs from "../../assets/categories/tabs.avif";
import Watches from "../../assets/categories/smart-watches.jpg";
import Airpods from "../../assets/categories/airpods.avif";
import Books from "../../assets/categories/books.webp";
import Shirts from "../../assets/categories/shirts.jpg";
import Pants from "../../assets/categories/pants.jpg";
import Phone from "../../assets/products/mobiles/phone.jpg";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Mail,
  AlertTriangle,
  PackageOpen,
  Star,
} from "lucide-react";

const THEME = `
  :root {
    --color-porcelain: #f1f5f2;
    --color-soft-fawn: #c2a878;
    --color-olive-bark: #6e633d;
    --color-cwhite: #fdfdff;
    --color-hunter-green: #355834;
    --color-evergreen: #14281d;
  }
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
  .font-serif-display { font-family: 'Fraunces', serif; }
  .font-sans-body { font-family: 'Inter', sans-serif; }
`;

const categoryImages = {
  Mobiles,
  Laptops,
  Tablets: Tabs,
  "Smart watches": Watches,
  Airpods,
  Books,
  Shirts,
  Pants,
};

const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");

  const [featured, setFeatured] = useState([]);
  const [featLoading, setFeatLoading] = useState(true);
  const [featError, setFeatError] = useState("");

  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [addingId, setAddingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCatLoading(true);
        setCatError("");
        const res = await api.get("/categories");
        console.log("CATEGORIES RESPONSE:", res.data);
        console.log("IS ARRAY:", Array.isArray(res.data));
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setCatError("Couldn't load categories");
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturedAndFavourites = async () => {
      try {
        setFeatLoading(true);
        setFeatError("");

        const [productsRes, favouritesRes] = await Promise.allSettled([
          api.get("/products"),
          api.get("/favourites"),
        ]);

        if (productsRes.status === "fulfilled") {
          setFeatured((productsRes.value.data || []).slice(0, 8));
        } else {
          throw productsRes.reason;
        }

        if (favouritesRes.status === "fulfilled") {
          const favIds = (favouritesRes.value.data || []).map(
            (f) => f.productId ?? f.product?.id ?? f.id,
          );
          setFavouriteIds(new Set(favIds));
        }
      } catch (err) {
        console.error(err);
        setFeatError("Couldn't load featured products");
      } finally {
        setFeatLoading(false);
      }
    };
    fetchFeaturedAndFavourites();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const toggleFavourite = async (productId) => {
    const isFav = favouriteIds.has(productId);
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(productId) : next.add(productId);
      return next;
    });
    try {
      if (isFav) {
        await api.delete(`/favourites/${productId}`);
      } else {
        await api.post("/favourites", { productId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update favourites");
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(productId) : next.delete(productId);
        return next;
      });
    }
  };

  const addToCart = async (productId) => {
    setAddingId(productId);
    try {
      await api.post("/cart/items", { productId, quantity: 1 });
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      toast.success("Subscribed! Watch your inbox for deals.");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't subscribe right now");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div
      className="font-sans-body"
      style={{ backgroundColor: "var(--color-porcelain)" }}
    >
      <style>{THEME}</style>
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-evergreen)" }}
      >
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 relative z-10">
          <p
            className="uppercase tracking-widest text-xs font-medium mb-4"
            style={{ color: "var(--color-soft-fawn)" }}
          >
            New season, new arrivals
          </p>
          <h1
            className="font-serif-display text-4xl md:text-6xl leading-tight max-w-2xl"
            style={{ color: "var(--color-cwhite)" }}
          >
            Everything you need, curated in one place
          </h1>
          <p
            className="mt-5 max-w-lg text-base md:text-lg"
            style={{ color: "rgba(253,253,255,0.75)" }}
          >
            From gadgets to everyday essentials — quality picks, fair prices,
            delivered fast.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-xl relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full rounded-full py-4 pl-6 pr-14 text-sm outline-none focus:ring-2 focus:ring-[var(--color-soft-fawn)]"
              style={{
                backgroundColor: "var(--color-cwhite)",
                color: "var(--color-evergreen)",
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "var(--color-hunter-green)" }}
            >
              <Search size={18} color="var(--color-cwhite)" strokeWidth={2} />
            </button>
          </form>
        </div>

        {/* decorative image */}
        <img
          src={Gadgets}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute right-[-40px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] object-cover rounded-full opacity-90"
          style={{ boxShadow: "0 0 0 8px rgba(253,253,255,0.06)" }}
        />
      </section>

      {/* Trust badges */}
      <section
        className="border-b"
        style={{
          backgroundColor: "var(--color-cwhite)",
          borderColor: "rgba(194,168,120,0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, label: "Free shipping", sub: "On orders over ₹999" },
            {
              icon: ShieldCheck,
              label: "Secure payment",
              sub: "100% protected",
            },
            { icon: RotateCcw, label: "Easy returns", sub: "7-day window" },
            { icon: Headset, label: "24/7 support", sub: "We're here to help" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon
                size={22}
                strokeWidth={1.5}
                style={{ color: "var(--color-hunter-green)" }}
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-evergreen)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-olive-bark)" }}
                >
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2
              className="font-serif-display text-3xl"
              style={{ color: "var(--color-evergreen)" }}
            >
              Top Categories
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-olive-bark)" }}
            >
              Shop by what you're looking for
            </p>
          </div>
        </div>

        {catLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[180px] rounded-md animate-pulse"
                style={{ backgroundColor: "var(--color-cwhite)" }}
              />
            ))}
          </div>
        )}

        {!catLoading && catError && (
          <div className="flex flex-col items-center text-center py-16">
            <AlertTriangle
              size={24}
              strokeWidth={1.5}
              style={{ color: "var(--color-evergreen)" }}
            />
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-olive-bark)" }}
            >
              {catError}
            </p>
          </div>
        )}

        {!catLoading && !catError && categories.length === 0 && (
          <div className="flex flex-col items-center text-center py-16">
            <PackageOpen
              size={24}
              strokeWidth={1.5}
              style={{ color: "var(--color-evergreen)" }}
            />
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-olive-bark)" }}
            >
              No categories to show yet.
            </p>
          </div>
        )}

        {!catLoading && !catError && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-md relative group cursor-pointer overflow-hidden"
                style={{ backgroundColor: "var(--color-hunter-green)" }}
                onClick={() => navigate(`/products/category/${category.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    navigate(`/products/category/${category.id}`);
                }}
              >
                <img
                  src={categoryImages[category.name] || Gadgets}
                  alt={category.name}
                  className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                  <p
                    className="text-xl font-semibold tracking-wide"
                    style={{ color: "var(--color-cwhite)" }}
                  >
                    {category.name.toUpperCase()}
                  </p>
                  <p
                    className="mt-2 text-xs flex items-center gap-1 opacity-90"
                    style={{ color: "var(--color-soft-fawn)" }}
                  >
                    Shop now <ArrowRight size={12} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2
              className="font-serif-display text-3xl"
              style={{ color: "var(--color-evergreen)" }}
            >
              Featured Products
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-olive-bark)" }}
            >
              Handpicked, popular right now
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="hidden md:flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-hunter-green)" }}
          >
            View all <ArrowRight size={15} />
          </button>
        </div>

        {featLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-sm border"
                style={{
                  backgroundColor: "var(--color-cwhite)",
                  borderColor: "rgba(194,168,120,0.2)",
                }}
              >
                <div
                  className="h-44 animate-pulse"
                  style={{ backgroundColor: "var(--color-porcelain)" }}
                />
                <div className="p-4 space-y-3">
                  <div
                    className="h-4 rounded animate-pulse w-3/4"
                    style={{ backgroundColor: "var(--color-porcelain)" }}
                  />
                  <div
                    className="h-4 rounded animate-pulse w-1/2"
                    style={{ backgroundColor: "var(--color-porcelain)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!featLoading && featError && (
          <div className="flex flex-col items-center text-center py-16">
            <AlertTriangle
              size={24}
              strokeWidth={1.5}
              style={{ color: "var(--color-evergreen)" }}
            />
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-olive-bark)" }}
            >
              {featError}
            </p>
          </div>
        )}

        {!featLoading && !featError && featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featured.map((product) => {
              const isFav = favouriteIds.has(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--color-cwhite)",
                    borderColor: "rgba(194,168,120,0.2)",
                  }}
                >
                  <button
                    onClick={() => toggleFavourite(product.id)}
                    aria-label={
                      isFav ? "Remove from favourites" : "Add to favourites"
                    }
                    aria-pressed={isFav}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                    style={{ backgroundColor: "rgba(253,253,255,0.9)" }}
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.75}
                      className={isFav ? "fill-red-500 text-red-500" : ""}
                      style={
                        !isFav
                          ? { color: "var(--color-olive-bark)" }
                          : undefined
                      }
                    />
                  </button>

                  <div
                    className="h-44 flex items-center justify-center cursor-pointer overflow-hidden"
                    style={{ backgroundColor: "var(--color-porcelain)" }}
                  >
                    <img
                      src={product.imageUrl || Phone}
                      alt={product.name}
                      className="max-h-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-medium text-sm leading-snug line-clamp-2 cursor-pointer"
                      style={{ color: "var(--color-evergreen)" }}
                    >
                      {product.name}
                    </h3>

                    {product.rating && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star
                          size={12}
                          className="fill-[var(--color-soft-fawn)] text-[var(--color-soft-fawn)]"
                        />
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-olive-bark)" }}
                        >
                          {product.rating}
                        </span>
                      </div>
                    )}

                    <p
                      className="text-lg font-semibold mt-2"
                      style={{ color: "var(--color-hunter-green)" }}
                    >
                      ₹{product.price?.toLocaleString()}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate("/checkout")}
                        className="flex-1 py-2 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
                        style={{
                          backgroundColor: "var(--color-hunter-green)",
                          color: "var(--color-cwhite)",
                        }}
                      >
                        <ShoppingBag
                          size={13}
                          className="inline -mt-0.5 mr-1"
                        />
                        Buy
                      </button>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={addingId === product.id}
                        className="flex-1 py-2 rounded-full text-xs font-medium border transition-all active:scale-[0.98] disabled:opacity-50"
                        style={{
                          borderColor: "var(--color-hunter-green)",
                          color: "var(--color-hunter-green)",
                        }}
                      >
                        {addingId === product.id ? (
                          "…"
                        ) : (
                          <>
                            <ShoppingCart
                              size={13}
                              className="inline -mt-0.5 mr-1"
                            />
                            Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate("/products")}
          className="md:hidden w-full mt-6 flex items-center justify-center gap-1 text-sm font-medium py-3 rounded-full border"
          style={{
            borderColor: "var(--color-hunter-green)",
            color: "var(--color-hunter-green)",
          }}
        >
          View all products <ArrowRight size={15} />
        </button>
      </section>

      {/* Newsletter */}
      <section style={{ backgroundColor: "var(--color-hunter-green)" }}>
        <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2
              className="font-serif-display text-2xl md:text-3xl"
              style={{ color: "var(--color-cwhite)" }}
            >
              Get 10% off your first order
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "rgba(253,253,255,0.75)" }}
            >
              Sign up for restock alerts, drops, and early access to sales.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full md:w-auto flex gap-2 max-w-md"
          >
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-olive-bark)" }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full py-3 pl-11 pr-4 text-sm outline-none"
                style={{
                  backgroundColor: "var(--color-cwhite)",
                  color: "var(--color-evergreen)",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={subscribing}
              className="px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap disabled:opacity-60"
              style={{
                backgroundColor: "var(--color-soft-fawn)",
                color: "var(--color-evergreen)",
              }}
            >
              {subscribing ? "…" : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "var(--color-evergreen)" }}>
        <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1">
            <p
              className="font-serif-display text-xl"
              style={{ color: "var(--color-cwhite)" }}
            >
              Store
            </p>
            <p className="mt-3" style={{ color: "rgba(253,253,255,0.6)" }}>
              Quality picks, fair prices, delivered fast.
            </p>
          </div>
          {[
            { title: "Shop", links: ["All Products", "Categories", "Deals"] },
            {
              title: "Support",
              links: ["Contact Us", "Shipping Info", "Returns"],
            },
            { title: "Company", links: ["About", "Careers", "Privacy Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <p
                className="font-medium mb-3"
                style={{ color: "var(--color-cwhite)" }}
              >
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link} style={{ color: "rgba(253,253,255,0.6)" }}>
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="border-t px-5 py-5 text-center text-xs"
          style={{
            borderColor: "rgba(253,253,255,0.1)",
            color: "rgba(253,253,255,0.5)",
          }}
        >
          © {new Date().getFullYear()} Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
