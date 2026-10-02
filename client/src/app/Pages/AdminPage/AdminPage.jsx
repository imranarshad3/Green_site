import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LayoutDashboard, Mail, Menu, Package, ShoppingBag, Store, Tag } from "lucide-react";

import { useSupabase } from "../../Context/SupabaseContext";
import AdminSidebar from "./AdminSidebar/AdminSidebar";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AdminProducts from "./AdminProducts/AdminProducts";
import AdminOrders from "./AdminOrders/AdminOrders";
import AdminMessages from "./AdminMessages/AdminMessages";
import AdminPromos from "./AdminPromos/AdminPromos";
import "./AdminPage.css";

const PAGES = {
  dashboard: {
    label: "Dashboard",
    title: "Dashboard",
    description: "How the store is doing at a glance.",
    icon: LayoutDashboard,
    panel: AdminDashboard,
  },
  products: {
    label: "Products",
    title: "Products",
    description: "Add, edit and delete plants and fertilizers, and keep stock up to date.",
    icon: Package,
    panel: AdminProducts,
  },
  orders: {
    label: "Orders",
    title: "Orders",
    description: "Track orders, add tracking numbers and handle returns.",
    icon: ShoppingBag,
    panel: AdminOrders,
    badgeLabel: "orders to ship",
  },
  promos: {
    label: "Promotions",
    title: "Promotions",
    description: "Promo codes customers can apply at checkout.",
    icon: Tag,
    panel: AdminPromos,
  },
  messages: {
    label: "Messages",
    title: "Messages",
    description: "Questions sent through the contact form.",
    icon: Mail,
    panel: AdminMessages,
    badgeLabel: "unread messages",
  },
};

const GROUPS = [
  { label: "Overview", items: ["dashboard"] },
  { label: "Store", items: ["products", "orders", "promos", "messages"] },
].map((group) => ({
  label: group.label,
  items: group.items.map((id) => ({ id, ...PAGES[id] })),
}));

const todayLabel = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

function AdminPage() {
  const supabase = useSupabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [counts, setCounts] = useState({});

  const active = PAGES[searchParams.get("tab")] ? searchParams.get("tab") : "dashboard";
  const page = PAGES[active];
  const Panel = page.panel;

  const select = (id) => {
    setSearchParams(id === "dashboard" ? {} : { tab: id });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "processing"),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("handled", false),
    ]).then(([orders, messages]) => {
      setCounts({ orders: orders.count ?? 0, messages: messages.count ?? 0 });
    });
  }, [supabase, active]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <div className="admin-page adm-shell">
      <AdminSidebar
        groups={GROUPS}
        active={active}
        onSelect={select}
        counts={counts}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="adm-content">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={20} />
          </button>

          <div className="adm-heading">
            <p className="adm-crumb">
              Admin <span aria-hidden="true">/</span> {page.label}
            </p>
            <h1>{page.title}</h1>
            <p className="adm-description">{page.description}</p>
          </div>

          <div className="adm-topbar-side">
            <span className="adm-date">{todayLabel()}</span>
            <Link to="/" className="adm-topbar-store">
              <Store size={16} />
              View store
            </Link>
          </div>
        </header>

        <main className="adm-main">
          <div key={active} className="adm-panel">
            <Panel onNavigate={select} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPage;
