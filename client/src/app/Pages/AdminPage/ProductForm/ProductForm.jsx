import React, { useState } from "react";
import { X } from "lucide-react";

import { useSupabase } from "../../../Context/SupabaseContext";
import {
  PRODUCT_IMAGES_BUCKET,
  PRODUCT_STATUSES,
  getImageUrl,
} from "../../../utils/products";

const CARE_LEVELS = ["Easy", "Moderate", "Expert"];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toForm = (product, defaultType) => ({
  type: product?.type ?? defaultType ?? "plant",
  name: product?.name ?? "",
  slug: product?.slug ?? "",
  category: product?.category ?? "",
  price: product?.price ?? "",
  oldPrice: product?.oldPrice ?? "",
  badge: product?.badge ?? "",
  careLevel: product?.careLevel ?? "",
  light: product?.light ?? "",
  watering: product?.watering ?? "",
  petFriendly: product?.petFriendly ?? false,
  colors: (product?.colors ?? []).join(", "),
  description: product?.description ?? "",
  status: product?.status ?? "active",
  stock: product?.stock ?? 0,
  imagePaths: product?.imagePaths ?? [],
});

const blankToNull = (value) => (value === "" ? null : value);

const toRow = (form) => ({
  type: form.type,
  name: form.name.trim(),
  slug: form.slug.trim() || slugify(form.name),
  category: form.category.trim(),
  price: Number(form.price),
  old_price: form.oldPrice === "" ? null : Number(form.oldPrice),
  badge: blankToNull(form.badge.trim().toUpperCase()),
  images: form.imagePaths,
  description: form.description.trim(),
  status: form.status,
  stock: Number(form.stock),
  care_level: form.type === "plant" ? blankToNull(form.careLevel) : null,
  light: form.type === "plant" ? blankToNull(form.light.trim()) : null,
  watering: form.type === "plant" ? blankToNull(form.watering.trim()) : null,
  pet_friendly: form.type === "plant" ? form.petFriendly : null,
  colors:
    form.type === "plant"
      ? form.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean)
      : [],
});

function ProductForm({ product, defaultType, onDone, onCancel }) {
  const supabase = useSupabase();
  const [form, setForm] = useState(() => toForm(product, defaultType));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const isPlant = form.type === "plant";

  const update = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const uploadImages = async (event) => {
    const files = [...event.target.files];
    event.target.value = "";

    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    const uploaded = [];

    for (const file of files) {
      const extension = file.name.split(".").pop().toLowerCase();
      const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
      const path = `${form.type}s/${Date.now()}-${base}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        break;
      }

      uploaded.push(path);
    }

    setForm((previous) => ({
      ...previous,
      imagePaths: [...previous.imagePaths, ...uploaded],
    }));
    setUploading(false);
  };

  const removeImage = (path) => {
    setForm((previous) => ({
      ...previous,
      imagePaths: previous.imagePaths.filter((item) => item !== path),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const row = toRow(form);
    const table = supabase.from("products");
    const { error: saveError } = product
      ? await table.update(row).eq("id", product.id)
      : await table.insert(row);

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    onDone();
  };

  return (
    <form className="admin-section admin-form" onSubmit={handleSubmit}>
      <div className="admin-section-head">
        <h2>{product ? `Edit ${product.name}` : "New product"}</h2>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-grid">
        <label>
          Type
          <select value={form.type} onChange={update("type")}>
            <option value="plant">Plant</option>
            <option value="fertilizer">Fertilizer</option>
          </select>
        </label>

        <label>
          Name
          <input required value={form.name} onChange={update("name")} />
        </label>

        <label>
          URL slug
          <input
            value={form.slug}
            onChange={update("slug")}
            placeholder={slugify(form.name) || "generated-from-name"}
          />
        </label>

        <label>
          Category
          <input
            required
            value={form.category}
            onChange={update("category")}
            placeholder={isPlant ? "Foliage" : "Root Care"}
          />
        </label>

        <label>
          Price ($)
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={update("price")}
          />
        </label>

        <label>
          Old price ($, optional)
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.oldPrice}
            onChange={update("oldPrice")}
          />
        </label>

        <label>
          Badge (optional)
          <input
            value={form.badge}
            onChange={update("badge")}
            placeholder="NEW, SALE, BESTSELLER"
          />
        </label>

        {isPlant && (
          <>
            <label>
              Care level
              <select value={form.careLevel} onChange={update("careLevel")}>
                <option value="">—</option>
                {CARE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Light
              <input value={form.light} onChange={update("light")} />
            </label>

            <label>
              Watering
              <input value={form.watering} onChange={update("watering")} />
            </label>

            <label>
              Pot colors (hex, comma separated)
              <input
                value={form.colors}
                onChange={update("colors")}
                placeholder="#292929, #e9b86d"
              />
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.petFriendly}
                onChange={update("petFriendly")}
              />
              Pet friendly
            </label>
          </>
        )}

        <label>
          Status
          <select value={form.status} onChange={update("status")}>
            {PRODUCT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Stock
          <input
            required
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={update("stock")}
          />
        </label>

        <label className="admin-form-wide">
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={update("description")}
          />
        </label>
      </div>

      <div className="admin-images">
        <p className="admin-label">Images (the first one is the main photo)</p>

        <div className="admin-image-list">
          {form.imagePaths.map((path) => (
            <div className="admin-image" key={path}>
              <img src={getImageUrl(path)} alt="" />
              <button
                type="button"
                onClick={() => removeImage(path)}
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <label className="admin-image-upload">
            {uploading ? "Uploading…" : "+ Upload"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={uploadImages}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-button secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="admin-button"
          disabled={saving || uploading}
        >
          {saving ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
