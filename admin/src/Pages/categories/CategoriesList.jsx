import React, { useEffect, useState } from "react";
import { Plus, Pencil, EyeOff, Eye, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../axios/api";
import CategoryForm from "./CategoryForm";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (category) => {
    setBusyId(category.id);
    const endpoint = category.enabled === false ? "enable" : "disable";
    try {
      await api.patch(`/admin/categories/${category.id}/${endpoint}`);
      toast.success(endpoint === "enable" ? "Category enabled" : "Category disabled");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update category status");
    } finally {
      setBusyId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl" style={{ color: "var(--color-evergreen)" }}>
            Categories
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-olive-bark)" }}>
            Organize products into categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "var(--color-hunter-green)", color: "var(--color-cwhite)" }}
        >
          <Plus size={15} /> New category
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-cwhite)", borderColor: "rgba(194,168,120,0.2)" }}>
        {loading && <p className="text-sm px-5 py-8 text-center" style={{ color: "var(--color-olive-bark)" }}>Loading…</p>}

        {!loading && error && (
          <div className="flex flex-col items-center text-center py-12">
            <AlertTriangle size={20} style={{ color: "var(--color-evergreen)" }} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-olive-bark)" }}>{error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="text-sm px-5 py-8 text-center" style={{ color: "var(--color-olive-bark)" }}>
            No categories yet — create your first one.
          </p>
        )}

        {!loading && !error && categories.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--color-olive-bark)" }}>
                <th className="px-5 py-3 font-medium text-xs">Name</th>
                <th className="px-5 py-3 font-medium text-xs">Status</th>
                <th className="px-5 py-3 font-medium text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const enabled = category.enabled !== false;
                return (
                  <tr key={category.id} className="border-t" style={{ borderColor: "rgba(194,168,120,0.15)" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--color-evergreen)" }}>
                      {category.name}
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
                          onClick={() => openEdit(category)}
                          className="p-2 rounded-lg hover:bg-black/5"
                          style={{ color: "var(--color-hunter-green)" }}
                          aria-label="Edit category"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleStatus(category)}
                          disabled={busyId === category.id}
                          className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-50"
                          style={{ color: "var(--color-olive-bark)" }}
                          aria-label={enabled ? "Disable category" : "Enable category"}
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
        <CategoryForm
          category={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
};

export default CategoriesList;
