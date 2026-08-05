import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  PENDING: "bg-soft-fawn/20 text-olive-bark border-soft-fawn/40",
  CONFIRMED: "bg-hunter-green/10 text-hunter-green border-hunter-green/30",
  SHIPPED: "bg-hunter-green/10 text-hunter-green border-hunter-green/30",
  DELIVERED: "bg-hunter-green/15 text-evergreen border-hunter-green/40",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-porcelain">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-soft-fawn border-t-hunter-green animate-spin" />
            <p className="text-olive-bark text-sm tracking-wide">Loading your orders…</p>
          </div>
        </div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-porcelain px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-cwhite border border-soft-fawn/40 flex items-center justify-center mb-6 shadow-sm">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#355834" strokeWidth="1.5">
              <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 11h5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-serif-display text-3xl text-evergreen mb-2">No orders yet</h1>
          <p className="text-olive-bark mb-6 max-w-sm">
            Once you place an order, you'll be able to track it right here.
          </p>
          <a
            href="/products"
            className="bg-hunter-green text-cwhite px-6 py-3 rounded-full font-medium hover:bg-evergreen transition-colors"
          >
            Start shopping
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
      `}</style>
      <Navbar />

      <div className="bg-porcelain min-h-screen font-sans-body">
        <div className="max-w-5xl mx-auto px-5 pt-10 pb-16">
          <h1 className="font-serif-display text-4xl text-evergreen mb-1">My Orders</h1>
          <p className="text-olive-bark text-sm mb-8">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>

          <div className="space-y-4">
            {orders.map((order) => {
              const products = order.products || [];
              const firstProduct = products[0];
              const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;

              return (
                <div
                  key={order.orderId}
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                  className="bg-cwhite rounded-2xl border border-soft-fawn/20 p-5 hover:shadow-lg hover:border-soft-fawn/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex gap-4">
                      {products.length > 0 && (
                        <div className="flex -space-x-3 flex-shrink-0">
                          {products.slice(0, 4).map((product) => (
                            <img
                              key={product.productId}
                              src={product.productImage}
                              alt={product.productName}
                              className="w-16 h-16 object-contain rounded-xl border-2 border-cwhite bg-porcelain shadow-sm"
                            />
                          ))}

                          {products.length > 4 && (
                            <div className="w-16 h-16 rounded-xl bg-porcelain flex items-center justify-center border-2 border-cwhite font-semibold text-evergreen text-sm">
                              +{products.length - 4}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col justify-center min-w-0">
                        <h2 className="font-medium text-evergreen truncate">
                          {firstProduct?.productName || "Order items unavailable"}
                        </h2>

                        {products.length > 1 && (
                          <p className="text-olive-bark text-sm">
                            +{products.length - 1} more item
                            {products.length > 2 ? "s" : ""}
                          </p>
                        )}

                        <p className="text-olive-bark text-sm mt-1.5">
                          #{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-evergreen mt-1">
                          {order.totalItems} item{order.totalItems !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end gap-3 md:gap-2 flex-shrink-0">
                      <span
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap ${statusStyle}`}
                      >
                        {order.status}
                      </span>

                      <span className="font-serif-display text-xl text-hunter-green">
                        ₹{Number(order.totalAmount).toLocaleString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.orderId}`);
                        }}
                        className="text-sm font-medium text-hunter-green hover:text-evergreen underline underline-offset-4 md:hidden"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;