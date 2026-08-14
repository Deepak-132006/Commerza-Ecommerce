import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../axios/api";

const CategoryForm = ({ category, onClose, onSaved }) => {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/admin/categories/${category.id}`, { name, description });
        toast.success("Category updated");
      } else {
        await api.post("/admin/categories", { name, description });
        toast.success("Category created");
      }
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Couldn't save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ backgroundColor: "rgba(20,40,29,0.5)" }}>
      <div className="w-full max-w-sm rounded-xl p-6" style={{ backgroundColor: "var(--color-cwhite)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg" style={{ color: "var(--color-evergreen)" }}>
            {isEdit ? "Edit category" : "New category"}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ color: "var(--color-olive-bark)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border focus:ring-2"
              style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)" }}
              placeholder="e.g. Laptops"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border focus:ring-2 resize-none"
              style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)" }}
              placeholder="Optional"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-olive-bark)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{ backgroundColor: "var(--color-hunter-green)", color: "var(--color-cwhite)" }}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
