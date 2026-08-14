import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../axios/api";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError("Couldn't load this order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const updateStatus = async (status) => {
    if (!order || status === order.status) return;
    setUpdating(true);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success(`Marked ${status.toLowerCase()}`);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: "var(--color-hunter-green)" }}
      >
        <ArrowLeft size={14} /> Back to orders
      </button>

      {loading && <p className="text-sm" style={{ color: "var(--color-olive-bark)" }}>Loading…</p>}

      {!loading && error && (
        <div className="flex flex-col items-center text-center py-12">
          <AlertTriangle size={20} style={{ color: "var(--color-evergreen)" }} />
          <p className="mt-2 text-sm" style={{ color: "var(--color-olive-bark)" }}>{error}</p>
        </div>
      )}

      {!loading && !error && order && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-2xl" style={{ color: "var(--color-evergreen)" }}>
                Order #{order.id}
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-olive-bark)" }}>
                {order.createdAt || order.placedAt || ""}
              </p>
            </div>
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 outline-none border"
              style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)", backgroundColor: "var(--color-cwhite)" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-cwhite)", borderColor: "rgba(194,168,120,0.2)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(194,168,120,0.2)" }}>
              <h2 className="font-display text-lg" style={{ color: "var(--color-evergreen)" }}>Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: "var(--color-olive-bark)" }}>
                  <th className="px-5 py-2 font-medium text-xs">Product</th>
                  <th className="px-5 py-2 font-medium text-xs">Qty</th>
                  <th className="px-5 py-2 font-medium text-xs">Price</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || order.orderItems || []).map((item, i) => (
                  <tr key={item.id ?? i} className="border-t" style={{ borderColor: "rgba(194,168,120,0.15)" }}>
                    <td className="px-5 py-3" style={{ color: "var(--color-evergreen)" }}>
                      {item.productName || item.name}
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--color-olive-bark)" }}>
                      {item.quantity}
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--color-evergreen)" }}>
                      ₹{item.price?.toLocaleString?.() ?? item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t flex justify-end" style={{ borderColor: "rgba(194,168,120,0.2)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--color-evergreen)" }}>
                Total: ₹{order.totalAmount?.toLocaleString?.() ?? order.total ?? "—"}
              </p>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--color-cwhite)", borderColor: "rgba(194,168,120,0.2)" }}>
              <h2 className="font-display text-lg mb-2" style={{ color: "var(--color-evergreen)" }}>Shipping address</h2>
              <p className="text-sm" style={{ color: "var(--color-olive-bark)" }}>{order.shippingAddress}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
