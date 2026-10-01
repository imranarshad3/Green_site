import React, { useState } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import AdminProducts from "./AdminProducts/AdminProducts";
import AdminOrders from "./AdminOrders/AdminOrders";
import AdminMessages from "./AdminMessages/AdminMessages";
import "./AdminPage.css";

const TABS = [
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "messages", label: "Messages" },
];

const PANELS = {
  products: AdminProducts,
  orders: AdminOrders,
  messages: AdminMessages,
};

function AdminPage() {
  const [tab, setTab] = useState("products");
  const Panel = PANELS[tab];

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-main">
        <header className="admin-header">
          <p className="admin-eyebrow">PLANTIFY ADMIN</p>
          <h1>Store management</h1>
        </header>

        <div className="admin-tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`admin-tab ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Panel />
      </main>
    </div>
  );
}

export default AdminPage;
