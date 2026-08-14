import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../axios/api";

// Field set assumed from CreateProductRequest/UpdateProductRequest — rename
// to match your actual DTO if it differs.
const ProductForm = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId ?? product?.category?.id ?? "",
    imageUrl: product?.imageUrl || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.categoryId) return;
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl,
    };

    try {
      if (isEdit) {
        await api.put(`/admin/products/${product.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/admin/products", payload);
        toast.success("Product created");
      }
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Couldn't save product");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm outline-none border focus:ring-2";
  const inputStyle = { borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 py-8 overflow-y-auto" style={{ backgroundColor: "rgba(20,40,29,0.5)" }}>
      <div className="w-full max-w-md rounded-xl p-6" style={{ backgroundColor: "var(--color-cwhite)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg" style={{ color: "var(--color-evergreen)" }}>
            {isEdit ? "Edit product" : "New product"}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ color: "var(--color-olive-bark)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>Name</label>
            <input type="text" required value={form.name} onChange={update("name")} className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>Description</label>
            <textarea rows={3} value={form.description} onChange={update("description")} className={`${inputClass} resize-none`} style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>Price (₹)</label>
              <input type="number" min={0} required value={form.price} onChange={update("price")} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>Stock</label>
              <input type="number" min={0} value={form.stock} onChange={update("stock")} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>Category</label>
            <select required value={form.categoryId} onChange={update("categoryId")} className={inputClass} style={inputStyle}>
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>Image URL</label>
            <input type="text" value={form.imageUrl} onChange={update("imageUrl")} placeholder="https://…" className={inputClass} style={inputStyle} />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-olive-bark)" }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60" style={{ backgroundColor: "var(--color-hunter-green)", color: "var(--color-cwhite)" }}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
