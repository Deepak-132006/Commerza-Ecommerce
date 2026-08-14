import React, { useEffect, useState } from "react";
import { Plus, Pencil, EyeOff, Eye, AlertTriangle, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../axios/api";
import ProductForm from "./ProductForm";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [stockDraft, setStockDraft] = useState({});

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      let res;
      if (search.trim()) {
        res = await api.get("/products/search", { params: { keyword: search.trim() } });
      } else if (categoryFilter) {
        res = await api.get(`/products/category/${categoryFilter}`);
      } else {
        res = await api.get("/products");
      }
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  const toggleStatus = async (product) => {
    setBusyId(product.id);
    const endpoint = product.enabled === false ? "enable" : "disable";
    try {
      await api.patch(`/admin/products/${product.id}/${endpoint}`);
      toast.success(endpoint === "enable" ? "Product enabled" : "Product disabled");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update product status");
    } finally {
      setBusyId(null);
    }
  };

  const submitStock = async (product) => {
    const value = stockDraft[product.id];
    if (value === undefined || value === "" || Number(value) === product.stock) return;
    setBusyId(product.id);
    try {
      await api.patch(`/admin/products/${product.id}/stock`, null, { params: { quantity: Number(value) } });
      toast.success("Stock updated");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update stock");
    } finally {
      setBusyId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl" style={{ color: "var(--color-evergreen)" }}>
            Products
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-olive-bark)" }}>
            Manage your catalog
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "var(--color-hunter-green)", color: "var(--color-cwhite)" }}
        >
          <Plus size={15} /> New product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-olive-bark)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setCategoryFilter("");
              setSearch(e.target.value);
            }}
            placeholder="Search products…"
            className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none border"
            style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)", backgroundColor: "var(--color-cwhite)" }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setSearch("");
            setCategoryFilter(e.target.value);
          }}
          className="rounded-lg px-3 py-2.5 text-sm outline-none border"
          style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)", backgroundColor: "var(--color-cwhite)" }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border overflow-x-auto" style={{ backgroundColor: "var(--color-cwhite)", borderColor: "rgba(194,168,120,0.2)" }}>
        {loading && <p className="text-sm px-5 py-8 text-center" style={{ color: "var(--color-olive-bark)" }}>Loading…</p>}

        {!loading && error && (
          <div className="flex flex-col items-center text-center py-12">
            <AlertTriangle size={20} style={{ color: "var(--color-evergreen)" }} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-olive-bark)" }}>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-sm px-5 py-8 text-center" style={{ color: "var(--color-olive-bark)" }}>
            No products found.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left" style={{ color: "var(--color-olive-bark)" }}>
                <th className="px-5 py-3 font-medium text-xs">Name</th>
                <th className="px-5 py-3 font-medium text-xs">Price</th>
                <th className="px-5 py-3 font-medium text-xs">Stock</th>
                <th className="px-5 py-3 font-medium text-xs">Status</th>
                <th className="px-5 py-3 font-medium text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const enabled = product.enabled !== false;
                return (
                  <tr key={product.id} className="border-t" style={{ borderColor: "rgba(194,168,120,0.15)" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--color-evergreen)" }}>
                      {product.name}
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--color-evergreen)" }}>
                      ₹{product.price?.toLocaleString?.() ?? product.price}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          defaultValue={product.stock}
                          onChange={(e) => setStockDraft((prev) => ({ ...prev, [product.id]: e.target.value }))}
                          onBlur={() => submitStock(product)}
                          className="w-16 rounded-md px-2 py-1 text-xs outline-none border"
                          style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)" }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: enabled ? "rgba(53,88,52,0.1)" : "rgba(110,99,61,0.1)",
                          color: enabled ? "var(--color-hunter-green)" : "var(--color-olive-bark)",
                        }}
                      >
                        {enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg hover:bg-black/5"
                          style={{ color: "var(--color-hunter-green)" }}
                          aria-label="Edit product"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleStatus(product)}
                          disabled={busyId === product.id}
                          className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-50"
                          style={{ color: "var(--color-olive-bark)" }}
                          aria-label={enabled ? "Disable product" : "Enable product"}
                        >
                          {enabled ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {formOpen && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

export default ProductsList;
