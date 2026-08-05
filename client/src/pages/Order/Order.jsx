import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import api from "../../axios/api";

const STATUS_STYLES = {
  PENDING: "bg-soft-fawn/20 text-olive-bark border-soft-fawn/40",
  CONFIRMED: "bg-hunter-green/10 text-hunter-green border-hunter-green/30",
  SHIPPED: "bg-hunter-green/10 text-hunter-green border-hunter-green/30",
  DELIVERED: "bg-hunter-green/15 text-evergreen border-hunter-green/40",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const Order = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const cancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-porcelain">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-soft-fawn border-t-hunter-green animate-spin" />
            <p className="text-olive-bark text-sm tracking-wide">Loading order…</p>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-porcelain px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-cwhite border border-soft-fawn/40 flex items-center justify-center mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#355834" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-serif-display text-2xl text-evergreen mb-1">Order not found</h2>
          <p className="text-olive-bark text-sm">Double-check the order link and try again.</p>
        </div>
      </>
    );
  }

  const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
      `}</style>
      <Navbar />

      <div className="bg-porcelain min-h-screen font-sans-body">
        <div className="max-w-4xl mx-auto px-5 pt-10 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div>
              <h1 className="font-serif-display text-4xl text-evergreen">Order Details</h1>
              <p className="text-olive-bark text-sm mt-1">#{order.orderNumber}</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border tracking-wide ${statusStyle}`}
            >
              {order.status}
            </span>
          </div>

          {/* Order info */}
          <div className="bg-cwhite rounded-2xl p-6 shadow-sm border border-soft-fawn/20 mb-8">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-olive-bark uppercase tracking-wide mb-1">Payment</p>
                <p className="text-evergreen font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-olive-bark uppercase tracking-wide mb-1">Date</p>
                <p className="text-evergreen font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="sm:col-span-2 pt-3 border-t border-porcelain flex items-baseline justify-between">
                <p className="text-evergreen font-medium">Total</p>
                <p className="font-serif-display text-2xl text-hunter-green">
                  ₹{Number(order.totalAmount).toLocaleString()}
                </p>
              </div>
            </div>

            {order.status === "PENDING" && (
              <button
                onClick={cancelOrder}
                disabled={cancelling}
                className="w-full sm:w-auto mt-6 border border-red-300 text-red-600 px-6 py-2.5 rounded-full font-medium hover:bg-red-50 active:scale-[0.97] transition-all disabled:opacity-50"
              >
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
          </div>

          {/* Products */}
          <h2 className="font-serif-display text-2xl text-evergreen mb-4">Products</h2>
          <div className="space-y-4 mb-8">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 bg-cwhite rounded-2xl p-4 shadow-sm border border-soft-fawn/20"
              >
                <div className="w-24 h-24 rounded-xl bg-porcelain overflow-hidden flex-shrink-0">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-medium text-evergreen">{item.productName}</h3>
                  <p className="text-sm text-olive-bark mt-1">
                    ₹{item.price} · Qty {item.quantity}
                  </p>
                  <p className="font-semibold text-hunter-green mt-1">₹{item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          <div className="bg-cwhite rounded-2xl p-6 shadow-sm border border-soft-fawn/20">
            <h2 className="font-serif-display text-xl text-evergreen mb-3">Shipping Address</h2>
            <p className="whitespace-pre-line text-olive-bark leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;