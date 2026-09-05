import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../axios/api";

// Adjust to match your OrderStatus enum values.
const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const statusColor = (status) => {
  switch (status) {
    case "DELIVERED":
      return {
        backgroundColor: "rgba(53,88,52,0.1)",
        color: "var(--color-hunter-green)",
      };
    case "CANCELLED":
      return { backgroundColor: "rgba(180,60,50,0.1)", color: "#b43c32" };
    default:
      return {
        backgroundColor: "rgba(194,168,120,0.2)",
        color: "var(--color-olive-bark)",
      };
  }
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/orders");

      console.log("ORDERS API RESPONSE:", res.data);

      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (order, status) => {
    if (status === order.status) return;

    setBusyId(order.orderId);

    try {
      await api.patch(`/admin/orders/${order.orderId}/status`, { status });

      toast.success(`Order #${order.orderId} marked ${status.toLowerCase()}`);

      load();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update order status");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-display text-2xl"
          style={{ color: "var(--color-evergreen)" }}
        >
          Orders
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-olive-bark)" }}
        >
          Track and update order status
        </p>
      </div>

      <div
        className="rounded-xl border overflow-x-auto"
        style={{
          backgroundColor: "var(--color-cwhite)",
          borderColor: "rgba(194,168,120,0.2)",
        }}
      >
        {loading && (
          <p
            className="text-sm px-5 py-8 text-center"
            style={{ color: "var(--color-olive-bark)" }}
          >
            Loading…
          </p>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center text-center py-12">
            <AlertTriangle
              size={20}
              style={{ color: "var(--color-evergreen)" }}
            />
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-olive-bark)" }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p
            className="text-sm px-5 py-8 text-center"
            style={{ color: "var(--color-olive-bark)" }}
          >
            No orders yet.
          </p>
        )}

        {!loading && !error && orders.length > 0 && (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr
                className="text-left"
                style={{ color: "var(--color-olive-bark)" }}
              >
                <th className="px-5 py-3 font-medium text-xs">Order</th>
                <th className="px-5 py-3 font-medium text-xs">Total</th>
                <th className="px-5 py-3 font-medium text-xs">Status</th>
                <th className="px-5 py-3 font-medium text-xs text-right">
                  Update
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-t"
                  style={{ borderColor: "rgba(194,168,120,0.15)" }}
                >
                  <td
                    className="px-5 py-3 font-medium"
                    style={{ color: "var(--color-evergreen)" }}
                  >
                    <Link
                      to={`/orders/${order.orderId}`}
                      className="hover:underline"
                    >
                      #{order.orderId}
                    </Link>
                  </td>

                  <td
                    className="px-5 py-3"
                    style={{ color: "var(--color-evergreen)" }}
                  >
                    ₹{order.totalAmount?.toLocaleString?.() ?? "—"}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={statusColor(order.status)}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <select
                      defaultValue={order.status}
                      disabled={busyId === order.orderId}
                      onChange={(e) => updateStatus(order, e.target.value)}
                      className="text-xs rounded-md px-2 py-1.5 outline-none border ml-auto block"
                      style={{
                        borderColor: "rgba(194,168,120,0.35)",
                        color: "var(--color-evergreen)",
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
