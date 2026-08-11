import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import Phone from "../../assets/products/mobiles/phone.jpg";
import api from "../../axios/api";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  AlertTriangle,
  SearchX,
  PackageOpen,
} from "lucide-react";

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
  .font-serif-display { font-family: 'Fraunces', serif; }
  .font-sans-body { font-family: 'Inter', sans-serif; }
`;

const Product = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [favouriteIds, setFavouriteIds] = useState(new Set());

  useEffect(() => {
    const fetchProductsAndFavourites = async () => {
      try {
        setLoading(true);
        setError("");

        const productsPromise = categoryId
          ? api.get(`/products/category/${categoryId}`)
          : api.get("/products");

        const [productsRes, favouritesRes] = await Promise.allSettled([
          productsPromise,
          api.get("/favourites"),
        ]);

        if (productsRes.status === "fulfilled") {
          setProducts(productsRes.value.data || []);
        } else {
          throw productsRes.reason;
        }

        if (favouritesRes.status === "fulfilled") {
          const favIds = (favouritesRes.value.data || []).map(
            (f) => f.productId ?? f.product?.id ?? f.id,
          );
          setFavouriteIds(new Set(favIds));
        } else {
          // favourites failing shouldn't block the product grid —
          // hearts just default to empty and can still be toggled
          console.error(favouritesRes.reason);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndFavourites();
  }, [categoryId]);

  const toggleFavourite = async (productId) => {
    const isFav = favouriteIds.has(productId);

    // optimistic update
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
      // rollback
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

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen font-sans-body"
      style={{ backgroundColor: "var(--color-porcelain)" }}
    >
      <style>{THEME}</style>
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 pt-10 pb-20">
        {/* Header / filter bar */}
        <div className="sticky top-0 z-10 -mx-5 px-5 py-4 mb-8 backdrop-blur-sm bg-[var(--color-porcelain)]/90 border-b border-[var(--color-soft-fawn)]/20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                className="font-serif-display text-3xl md:text-4xl"
                style={{ color: "var(--color-evergreen)" }}
              >
                {categoryId ? "Category" : "All Products"}
              </h1>
              {!loading && !error && (
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-olive-bark)" }}
                >
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full py-3 pl-5 pr-11 text-sm outline-none transition-shadow focus:ring-2"
                style={{
                  backgroundColor: "var(--color-cwhite)",
                  border: "1px solid rgba(194,168,120,0.3)",
                  color: "var(--color-evergreen)",
                }}
              />
              <Search
                size={16}
                strokeWidth={1.75}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--color-olive-bark)", opacity: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-sm border"
                style={{
                  backgroundColor: "var(--color-cwhite)",
                  borderColor: "rgba(194,168,120,0.2)",
                }}
              >
                <div
                  className="h-56 animate-pulse"
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
                  <div
                    className="h-9 rounded-full animate-pulse mt-4"
                    style={{ backgroundColor: "var(--color-porcelain)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <EmptyState
            icon={<AlertTriangle size={26} strokeWidth={1.5} />}
            title="Something went wrong"
            subtitle={`${error}. Try refreshing the page.`}
          />
        )}

        {/* Empty */}
        {!loading && !error && filteredProducts.length === 0 && (
          <EmptyState
            icon={
              searchTerm ? (
                <SearchX size={26} strokeWidth={1.5} />
              ) : (
                <PackageOpen size={26} strokeWidth={1.5} />
              )
            }
            title={
              searchTerm ? "No matches for that search" : "Nothing here yet"
            }
            subtitle={
              searchTerm
                ? "Try a different keyword or clear your search."
                : "This category is empty for now — check back soon."
            }
          />
        )}

        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
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
                  {/* Favourite */}
                  <button
                    onClick={() => toggleFavourite(product.id)}
                    aria-label={
                      isFav ? "Remove from favourites" : "Add to favourites"
                    }
                    aria-pressed={isFav}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
                    style={{ backgroundColor: "rgba(253,253,255,0.9)" }}
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.75}
                      className={isFav ? "fill-red-500 text-red-500" : ""}
                      style={
                        !isFav
                          ? { color: "var(--color-olive-bark)" }
                          : undefined
                      }
                    />
                  </button>

                  {/* Image */}
                  <div
                    className="h-56 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "var(--color-porcelain)" }}
                  >
                    <img
                      src={product.imageUrl || Phone}
                      alt={product.name}
                      className="max-h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h2
                      className="font-medium leading-snug line-clamp-2"
                      style={{ color: "var(--color-evergreen)" }}
                    >
                      {product.name}
                    </h2>

                    <p
                      className="text-sm mt-1.5 line-clamp-2"
                      style={{ color: "var(--color-olive-bark)" }}
                    >
                      {product.description}
                    </p>

                    <p
                      className="text-2xl font-semibold mt-3"
                      style={{ color: "var(--color-hunter-green)" }}
                    >
                      ₹{product.price?.toLocaleString()}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              buyNowProduct: product,
                            },
                          })
                        }
                        className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
                        style={{
                          backgroundColor: "var(--color-hunter-green)",
                          color: "var(--color-cwhite)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--color-evergreen)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--color-hunter-green)")
                        }
                      >
                        <ShoppingBag
                          size={15}
                          className="inline -mt-0.5 mr-1.5"
                        />
                        Buy Now
                      </button>

                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={addingId === product.id}
                        className="flex-1 py-2.5 rounded-full text-sm font-medium border transition-all active:scale-[0.98] disabled:opacity-50"
                        style={{
                          borderColor: "var(--color-hunter-green)",
                          color: "var(--color-hunter-green)",
                        }}
                      >
                        {addingId === product.id ? (
                          "Adding…"
                        ) : (
                          <>
                            <ShoppingCart
                              size={15}
                              className="inline -mt-0.5 mr-1.5"
                            />
                            Add Cart
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
      </div>
    </div>
  );
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center py-24">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-5 border"
      style={{
        backgroundColor: "var(--color-cwhite)",
        borderColor: "rgba(194,168,120,0.4)",
        color: "var(--color-evergreen)",
      }}
    >
      {icon}
    </div>
    <p
      className="font-serif-display text-xl mb-1"
      style={{ color: "var(--color-evergreen)" }}
    >
      {title}
    </p>
    <p
      className="text-sm max-w-sm"
      style={{ color: "var(--color-olive-bark)" }}
    >
      {subtitle}
    </p>
  </div>
);

export default Product;
