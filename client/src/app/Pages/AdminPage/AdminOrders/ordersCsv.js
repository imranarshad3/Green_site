const COLUMNS = [
  ["Order", (order) => order.id],
  ["Placed", (order) => order.createdAt],
  ["Status", (order) => order.status],
  ["Customer", (order) => order.shipping.name],
  ["Email", (order) => order.shipping.email],
  ["Phone", (order) => order.shipping.phone],
  ["Address", (order) => order.shipping.address],
  ["City", (order) => order.shipping.city],
  ["Postal code", (order) => order.shipping.postalCode],
  ["Items", (order) => order.items.map((item) => `${item.quantity}x ${item.name}`).join("; ")],
  ["Subtotal", (order) => order.subtotal.toFixed(2)],
  ["Discount", (order) => order.discount.toFixed(2)],
  ["Promo code", (order) => order.promoCode],
  ["Delivery", (order) => order.delivery.toFixed(2)],
  ["Total", (order) => order.total.toFixed(2)],
  ["Courier", (order) => order.courier],
  ["Tracking number", (order) => order.trackingNumber],
  ["Return", (order) => order.returnRequest?.status],
  ["Customer ID", (order) => order.userId],
];

const escapeCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function downloadOrdersCsv(orders) {
  const rows = [
    COLUMNS.map(([label]) => label),
    ...orders.map((order) => COLUMNS.map(([, read]) => read(order))),
  ];
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = `plantify-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
