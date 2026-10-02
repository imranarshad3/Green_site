import { getImageUrl } from "./products";
import { RETURN_DAYS } from "./storeInfo";

const STATUS_LABELS = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUSES = Object.keys(STATUS_LABELS);

export const statusLabel = (status) => STATUS_LABELS[status] ?? status;

export const formatOrderDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

export const formatOrderDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

export const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Delivery takes too long",
  "Want to change the items",
  "Other",
];

export const isCancellable = (order) => order?.statusType === "processing";

export const RETURN_REASONS = [
  "Arrived damaged",
  "Plant is unhealthy",
  "Wrong item received",
  "No longer needed",
  "Other",
];

export const RETURN_STATUS_LABELS = {
  requested: "Return requested",
  approved: "Return approved",
  rejected: "Return declined",
};

export const getReturnDeadline = (order) => {
  const start = order?.deliveredAt ?? order?.createdAt;
  return start ? new Date(new Date(start).getTime() + RETURN_DAYS * 86400000) : null;
};

export const isReturnable = (order) =>
  order?.statusType === "delivered" &&
  !order.returnRequest &&
  getReturnDeadline(order) >= new Date();

const toReturnRequest = (value) => {
  const row = Array.isArray(value) ? value[0] : value;

  return row
    ? {
        id: row.id,
        reason: row.reason,
        details: row.details,
        status: row.status,
        adminNote: row.admin_note,
        createdAt: row.created_at,
        resolvedAt: row.resolved_at,
      }
    : null;
};

export const getCustomerLabel = (order) =>
  order.shipping.name || order.shipping.email || `${order.userId.slice(0, 14)}…`;

export const toOrder = (row) => ({
  id: row.order_number,
  dbId: row.id,
  userId: row.user_id,
  createdAt: row.created_at,
  date: formatOrderDate(row.created_at),
  shippedAt: row.shipped_at,
  deliveredAt: row.delivered_at,
  cancelledAt: row.cancelled_at,
  cancelReason: row.cancel_reason,
  promoCode: row.promo_code ?? null,
  promoDiscount: Number(row.promo_discount ?? 0),
  courier: row.courier ?? null,
  trackingNumber: row.tracking_number ?? null,
  shipping: {
    name: row.shipping_name ?? null,
    email: row.shipping_email ?? null,
    phone: row.shipping_phone ?? null,
    address: row.shipping_address ?? null,
    city: row.shipping_city ?? null,
    postalCode: row.shipping_postal_code ?? null,
  },
  returnRequest: toReturnRequest(row.return_requests),
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

export const ORDER_SELECT = "*, order_items(*), return_requests(*)";
