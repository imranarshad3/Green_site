import { getImageUrl } from "./products";

const STATUS_LABELS = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Database row (with nested order_items) -> the shape the order UI uses.
export const toOrder = (row) => ({
  id: row.order_number,
  dbId: row.id,
  userId: row.user_id,
  date: new Date(row.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  status: STATUS_LABELS[row.status],
  statusType: row.status,
  subtotal: Number(row.subtotal),
  discount: Number(row.discount),
  delivery: Number(row.delivery),
  total: Number(row.total),
  items: (row.order_items ?? []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    name: item.name,
    image: getImageUrl(item.image),
    price: Number(item.price),
    quantity: item.quantity,
    size: item.size,
    potStyle: item.pot_style,
  })),
});

export const ORDER_SELECT = "*, order_items(*)";
