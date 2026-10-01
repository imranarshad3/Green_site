import React, { useState } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import SiteFooter from "../ProductDetails/SiteFooter/SiteFooter";

import OrdersHeader from "./Components/OrdersHeader/OrdersHeader";
import OrderFilters from "./Components/OrderFilters/OrderFilter"
import OrderCard from "./Components/OrderCard/OrderCard";
import EmptyOrders from "./Components/EmptyOrders/EmptyOrders";

import { orders } from "./data/OrdersData";

import "./OrdersPage.css";

function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.status.toLowerCase() ===
            activeFilter.toLowerCase()
        );

  return (
    <div className="orders-page">

      <Navbar />

      <main className="orders-main">

        <OrdersHeader />

        <OrderFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <section className="orders-list">

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))
          ) : (
            <EmptyOrders />
          )}

        </section>

      </main>

      <SiteFooter />

    </div>
  );
}

export default OrdersPage;

