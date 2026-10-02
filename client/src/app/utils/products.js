const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const PRODUCT_IMAGES_BUCKET = "product-images";

export const getImageUrl = (path) =>
  path
    ? `${SUPABASE_URL}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${path}`
    : "";

export const toProduct = (row) => ({
  id: row.id,
  type: row.type,
  name: row.name,
  slug: row.slug,
  category: row.category,
  price: Number(row.price),
  oldPrice: row.old_price === null ? null : Number(row.old_price),
  rating: row.rating === null ? null : Number(row.rating),
  reviews: row.reviews,
  badge: row.badge,
  imagePaths: row.images,
  images: row.images.map(getImageUrl),
  careLevel: row.care_level,
  colors: row.colors,
  light: row.light,
  watering: row.watering,
  petFriendly: row.pet_friendly,
  description: row.description,
  desc: row.description,
  status: row.status,
  stock: row.stock,
});

export const PRODUCT_STATUSES = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "coming_soon", label: "Coming soon" },
];

export const isPurchasable = (product) =>
  product?.status === "active" && product.stock > 0;

export const getAvailabilityLabel = (product) => {
  if (product?.status === "coming_soon") return "Coming soon";
  if (product?.stock <= 0) return "Sold out";
  return null;
};

export const getProductKey = (product) => `${product.type}-${product.id}`;

export const getProductPath = (product) =>
  product.type === "fertilizer"
    ? `/products/fertilizer/${product.id}`
    : `/product/${product.id}`;
