import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import Phone from "../../assets/products/mobiles/phone.jpg";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  ShoppingCart,
  ShoppingBag,
  AlertTriangle,
  HeartOff,
} from "lucide-react";

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
  .font-serif-display { font-family: 'Fraunces', serif; }
  .font-sans-body { font-family: 'Inter', sans-serif; }
`;

const Favourites = () => {
  const navigate = useNavigate();
  const [favt, setFavt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/favourites");
        setFavt(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const removeFavourite = async (productId) => {
    const removed = favt.find((f) => f.productId === productId);
    setRemovingId(productId);

    // optimistic removal
    setFavt((prev) => prev.filter((fav) => fav.productId !== productId));

    try {
      await api.delete(`/favourites/${productId}`);
      toast.success("Removed from favourites");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't remove favourite");
      // rollback — put it back where it was
      if (removed) {
        setFavt((prev) => {
          const next = [...prev];
          const idx = favt.findIndex((f) => f.productId === productId);
          next.splice(idx, 0, removed);
          return next;
        });
      }
    } finally {
      setRemovingId(null);
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

  return (
    <div
      className="min-h-screen font-sans-body"
      style={{ backgroundColor: "var(--color-porcelain)" }}
    >
      <style>{THEME}</style>
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 pt-10 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-serif-display text-3xl md:text-4xl flex items-center gap-3"
            style={{ color: "var(--color-evergreen)" }}
          >
            <Heart
              size={28}
              strokeWidth={1.75}
              className="fill-red-500 text-red-500"
            />
            My Favourites
          </h1>
          {!loading && !error && favt.length > 0 && (
            <p
              className="text-sm mt-1.5"
              style={{ color: "var(--color-olive-bark)" }}
            >
              {favt.length} item{favt.length !== 1 ? "s" : ""} saved
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
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
        {!loading && !error && favt.length === 0 && (
          <EmptyState
            icon={<HeartOff size={26} strokeWidth={1.5} />}
            title="No favourites yet"
            subtitle="Tap the heart on any product to save it here."
            action={
              <button
                onClick={() => navigate("/products")}
                className="mt-5 px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--color-hunter-green)",
                  color: "var(--color-cwhite)",
                }}
              >
                Browse products
              </button>
            }
          />
        )}

        {/* Favourites grid */}
        {!loading && !error && favt.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favt.map((fav) => {
              const isRemoving = removingId === fav.productId;
              return (
                <div
                  key={fav.id ?? fav.productId}
                  className={`group relative rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isRemoving ? "opacity-50 pointer-events-none" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--color-cwhite)",
                    borderColor: "rgba(194,168,120,0.2)",
                  }}
                >
                  {/* Heart — click to remove */}
                  <button
                    onClick={() => removeFavourite(fav.productId)}
                    aria-label="Remove from favourites"
                    aria-pressed="true"
                    disabled={isRemoving}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
                    style={{ backgroundColor: "rgba(253,253,255,0.9)" }}
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.75}
                      className="fill-red-500 text-red-500"
                    />
                  </button>

                  {/* Image */}
                  <div
                    className="h-56 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "var(--color-porcelain)" }}
                  >
                    <img
                      src={fav.imageUrl || Phone}
                      alt={fav.productName}
                      className="max-h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h2
                      className="font-medium leading-snug line-clamp-2"
                      style={{ color: "var(--color-evergreen)" }}
                    >
                      {fav.productName}
                    </h2>

                    <p
                      className="text-2xl font-semibold mt-3"
                      style={{ color: "var(--color-hunter-green)" }}
                    >
                      ₹{fav.price?.toLocaleString()}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate("/checkout")}
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
                        onClick={() => addToCart(fav.productId)}
                        disabled={addingId === fav.productId}
                        className="flex-1 py-2.5 rounded-full text-sm font-medium border transition-all active:scale-[0.98] disabled:opacity-50"
                        style={{
                          borderColor: "var(--color-hunter-green)",
                          color: "var(--color-hunter-green)",
                        }}
                      >
                        {addingId === fav.productId ? (
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

const EmptyState = ({ icon, title, subtitle, action }) => (
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
    {action}
  </div>
);

export default Favourites;
