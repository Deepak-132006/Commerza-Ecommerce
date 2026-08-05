import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import Search from "../../assets/icons/search.png";
import Phone from "../../assets/products/mobiles/phone.jpg";
import api from "../../axios/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Product = () => {
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let res;
        if (categoryId) {
          res = await api.get(`/products/category/${categoryId}`);
        } else {
          res = await api.get("/products");
        }

        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const addToCart = async (productId) => {
    setAddingId(productId);
    try {
      await api.post("/cart/items", {
        productId,
        quantity: 1,
      });

      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-porcelain font-sans-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <Navbar />

      <div className="max-w-6xl mx-auto px-5 pt-10 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif-display text-4xl text-evergreen">
              {categoryId ? "Category" : "All Products"}
            </h1>
            {!loading && (
              <p className="text-olive-bark text-sm mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-cwhite border border-soft-fawn/30 rounded-full py-3 pl-5 pr-11 text-sm text-evergreen placeholder:text-olive-bark/60 focus:outline-none focus:ring-2 focus:ring-hunter-green/40 transition-shadow"
            />
            <img
              src={Search}
              alt=""
              className="absolute w-4 right-4 top-1/2 -translate-y-1/2 opacity-60"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-cwhite rounded-2xl overflow-hidden shadow-sm border border-soft-fawn/20">
                <div className="h-56 bg-porcelain animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-porcelain rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-porcelain rounded animate-pulse w-1/2" />
                  <div className="h-9 bg-porcelain rounded-full animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center text-center py-24">
            <div className="w-16 h-16 rounded-full bg-cwhite border border-soft-fawn/40 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#355834" strokeWidth="1.5">
                <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-serif-display text-xl text-evergreen mb-1">Something went wrong</p>
            <p className="text-olive-bark text-sm">{error}. Try refreshing the page.</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center text-center py-24">
            <div className="w-16 h-16 rounded-full bg-cwhite border border-soft-fawn/40 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#355834" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-serif-display text-xl text-evergreen mb-1">
              {searchTerm ? "No matches for that search" : "Nothing here yet"}
            </p>
            <p className="text-olive-bark text-sm max-w-sm">
              {searchTerm
                ? "Try a different keyword or clear your search."
                : "This category is empty for now — check back soon."}
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-cwhite rounded-2xl overflow-hidden shadow-sm border border-soft-fawn/20 hover:shadow-lg hover:border-soft-fawn/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-56 flex items-center justify-center bg-porcelain overflow-hidden">
                  <img
                    src={product.imageUrl || Phone}
                    alt={product.name}
                    className="max-h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5">
                  <h2 className="font-medium text-evergreen line-clamp-2 leading-snug">
                    {product.name}
                  </h2>

                  <p className="text-olive-bark text-sm mt-1.5 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="font-roboto text-2xl text-hunter-green mt-3">
                    ₹{product.price?.toLocaleString()}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-hunter-green text-cwhite py-2.5 rounded-full text-sm font-medium hover:bg-evergreen active:scale-[0.98] transition-all">
                      Buy Now
                    </button>

                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={addingId === product.id}
                      className="flex-1 border border-hunter-green text-hunter-green py-2.5 rounded-full text-sm font-medium hover:bg-hunter-green hover:text-cwhite active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {addingId === product.id ? "Adding…" : "Add Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;