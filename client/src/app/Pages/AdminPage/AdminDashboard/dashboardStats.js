const DAY = 24 * 60 * 60 * 1000;

export const RANGES = [
  { id: "7d", label: "7 days", days: 7 },
  { id: "30d", label: "30 days", days: 30 },
  { id: "90d", label: "90 days", days: 90 },
  { id: "12m", label: "12 months", days: 365 },
  { id: "all", label: "All time", days: null },
];

export const STATUS_ORDER = ["processing", "shipped", "delivered", "cancelled"];

export const STATUS_LABELS = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date, months) => new Date(date.getFullYear(), date.getMonth() + months, 1);

export const formatMoney = (value, digits = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const formatCompactMoney = (value) =>
  value >= 1000
    ? `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`
    : `$${Math.round(value)}`;

export const formatCount = (value) => new Intl.NumberFormat("en-US").format(value);

export function rangeWindow(range, orders, now = new Date()) {
  const end = addDays(startOfDay(now), 1);
  if (range.days) {
    return { start: addDays(end, -range.days), end };
  }
  const first = orders.reduce(
    (earliest, order) => Math.min(earliest, new Date(order.createdAt).getTime()),
    end.getTime()
  );
  return { start: startOfMonth(new Date(Math.min(first, addMonths(startOfMonth(now), -5).getTime()))), end };
}

const inWindow = (order, { start, end }) => {
  const time = new Date(order.createdAt).getTime();
  return time >= start.getTime() && time < end.getTime();
};

const isCounted = (order) => order.statusType !== "cancelled";

function summarize(orders) {
  const counted = orders.filter(isCounted);
  const revenue = counted.reduce((sum, order) => sum + order.total, 0);
  const items = counted.reduce(
    (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
    0
  );
  return {
    revenue,
    orders: counted.length,
    averageOrder: counted.length ? revenue / counted.length : 0,
    customers: new Set(counted.map((order) => order.userId)).size,
    items,
  };
}

const change = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
};

function bucketPlan(range, window) {
  const spanDays = Math.round((window.end - window.start) / DAY);
  if (range.days && range.days <= 31) return { unit: "day", step: 1 };
  if (spanDays <= 120) return { unit: "day", step: 7 };
  return { unit: "month", step: 1 };
}

function bucketLabel(date, plan) {
  if (plan.unit === "month") {
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function bucketTitle(start, next, plan) {
  if (plan.unit === "month") {
    return start.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  if (plan.step === 1) {
    return start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }
  const last = addDays(next, -1);
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${last.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function buildSeries(orders, range, window) {
  const plan = bucketPlan(range, window);
  const buckets = [];
  let cursor = plan.unit === "month" ? startOfMonth(window.start) : window.start;

  while (cursor < window.end) {
    const next = plan.unit === "month" ? addMonths(cursor, plan.step) : addDays(cursor, plan.step);
    buckets.push({
      start: cursor,
      end: next < window.end ? next : window.end,
      label: bucketLabel(cursor, plan),
      title: bucketTitle(cursor, next < window.end ? next : window.end, plan),
      revenue: 0,
      orders: 0,
    });
    cursor = next;
  }

  for (const order of orders) {
    if (!isCounted(order)) continue;
    const time = new Date(order.createdAt).getTime();
    const bucket = buckets.find((item) => time >= item.start.getTime() && time < item.end.getTime());
    if (bucket) {
      bucket.revenue += order.total;
      bucket.orders += 1;
    }
  }

  return { plan, buckets };
}

function topProducts(orders, limit = 5) {
  const totals = new Map();
  for (const order of orders.filter(isCounted)) {
    for (const item of order.items) {
      const key = item.productId ?? item.name;
      const entry = totals.get(key) ?? { key, name: item.name, image: item.image, revenue: 0, quantity: 0 };
      entry.revenue += item.price * item.quantity;
      entry.quantity += item.quantity;
      totals.set(key, entry);
    }
  }
  return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

function statusBreakdown(orders) {
  const counts = Object.fromEntries(STATUS_ORDER.map((status) => [status, 0]));
  for (const order of orders) counts[order.statusType] = (counts[order.statusType] ?? 0) + 1;
  return STATUS_ORDER.map((status) => ({ status, label: STATUS_LABELS[status], count: counts[status] }));
}

export function buildDashboard(orders, rangeId, now = new Date()) {
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[1];
  const window = rangeWindow(range, orders, now);
  const current = orders.filter((order) => inWindow(order, window));
  const totals = summarize(current);
  const series = buildSeries(orders, range, window);

  let previous = null;
  if (range.days) {
    const previousWindow = { start: addDays(window.start, -range.days), end: window.start };
    previous = summarize(orders.filter((order) => inWindow(order, previousWindow)));
  }

  const deltas = previous
    ? {
        revenue: change(totals.revenue, previous.revenue),
        orders: change(totals.orders, previous.orders),
        averageOrder: change(totals.averageOrder, previous.averageOrder),
        customers: change(totals.customers, previous.customers),
        items: change(totals.items, previous.items),
      }
    : null;

  return {
    range,
    totals,
    deltas,
    comparisonLabel: range.days ? `vs previous ${range.label}` : null,
    series: series.buckets,
    granularity: series.plan.unit === "month" ? "Per month" : series.plan.step === 7 ? "Per week" : "Per day",
    statuses: statusBreakdown(current),
    topProducts: topProducts(current),
    recent: orders.slice(0, 6),
    openOrders: orders.filter((order) => order.statusType === "processing").length,
  };
}
