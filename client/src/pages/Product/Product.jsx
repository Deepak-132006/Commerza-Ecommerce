import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import Search from "../../assets/icons/search.png";
import Phone from "../../assets/products/mobiles/phone.jpg";
import api from "../../axios/api";
import { useParams } from "react-router-dom";

const Product = () => {
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/products/category/${categoryId}`
        );

        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-evergreen"
          />
          <img
            src={Search}
            alt="search"
            className="absolute w-5 right-4 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold font-inter text-evergreen">
          Products
        </h1>

        {!loading && (
          <p className="text-gray-600">
            {products.length} products found
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-lg">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500">
            No products available in this category
          </p>
        </div>
      )}

      {/* Products */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-60 flex items-center justify-center bg-gray-100">
                <img
                  src={product.imageUrl || Phone}
                  alt={product.name}
                  className="max-h-full object-contain p-4"
                />
              </div>

              <div className="p-4">
                <h2 className="font-bold text-lg line-clamp-2">
                  {product.name}
                </h2>

                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {product.description}
                </p>

                <p className="text-2xl font-bold text-evergreen mt-4">
                  ₹{product.price?.toLocaleString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-hunter-green text-white py-2 rounded-lg hover:opacity-90">
                    Buy Now
                  </button>

                  <button className="flex-1 border border-hunter-green text-hunter-green py-2 rounded-lg hover:bg-gray-50">
                    Add Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;