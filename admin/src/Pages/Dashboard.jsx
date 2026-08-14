import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Tags, ClipboardList, ArrowRight } from "lucide-react";
import api from "../axios/api";

const StatCard = ({ icon: Icon, label, value, to, loading }) => (
  <Link
    to={to}
    className="rounded-xl p-5 flex items-center justify-between border transition-shadow hover:shadow-sm"
    style={{ backgroundColor: "var(--color-cwhite)", borderColor: "rgba(194,168,120,0.2)" }}
  >
    <div>
      <p className="text-xs" style={{ color: "var(--color-olive-bark)" }}>
        {label}
      </p>
      <p className="font-display text-3xl mt-1" style={{ color: "var(--color-evergreen)" }}>
        {loading ? "…" : value}
      </p>
    </div>
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "var(--color-porcelain)" }}
    >
      <Icon size={18} style={{ color: "var(--color-hunter-green)" }} />
    </div>
  </Link>
);

const Dashboard = () => {
  const [counts, setCounts] = useState({ products: 0, categories: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.allSettled([
          api.get("/products"),
          api.get("/categories"),
          api.get("/admin/orders"),
        ]);

        setCounts({
          products: productsRes.status === "fulfilled" ? (productsRes.value.data || []).length : 0,
          categories: categoriesRes.status === "fulfilled" ? (categoriesRes.value.data || []).length : 0,
          orders: ordersRes.status === "fulfilled" ? (ordersRes.value.data || []).length : 0,
        });

        if (ordersRes.status === "fulfilled") {
          setRecentOrders((ordersRes.value.data || []).slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl mb-1" style={{ color: "var(--color-evergreen)" }}>
        Dashboard
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-olive-bark)" }}>
        Store overview
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Package} label="Products" value={counts.products} to="/products" loading={loading} />
        <StatCard icon={Tags} label="Categories" value={counts.categories} to="/categories" loading={loading} />
        <StatCard icon={ClipboardList} label="Orders" value={counts.orders} to="/orders" loading={loading} />
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-cwhite)", borderColor: "rgba(194,168,120,0.2)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(194,168,120,0.2)" }}>
          <h2 className="font-display text-lg" style={{ color: "var(--color-evergreen)" }}>
            Recent orders
          </h2>
          <Link to="/orders" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-hunter-green)" }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {!loading && recentOrders.length === 0 && (
          <p className="text-sm px-5 py-8 text-center" style={{ color: "var(--color-olive-bark)" }}>
            No orders yet.
          </p>
        )}

        {recentOrders.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--color-olive-bark)" }} className="text-left">
                <th className="px-5 py-2 font-medium text-xs">Order</th>
                <th className="px-5 py-2 font-medium text-xs">Status</th>
                <th className="px-5 py-2 font-medium text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t" style={{ borderColor: "rgba(194,168,120,0.15)" }}>
                  <td className="px-5 py-3" style={{ color: "var(--color-evergreen)" }}>
                    <Link to={`/orders/${order.id}`} className="hover:underline">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--color-olive-bark)" }}>
                    {order.status}
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--color-evergreen)" }}>
                    ₹{order.totalAmount?.toLocaleString?.() ?? order.total ?? "—"}
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

export default Dashboard;
