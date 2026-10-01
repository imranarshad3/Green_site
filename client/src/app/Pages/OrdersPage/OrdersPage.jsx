import React, { useState } from "react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import SiteFooter from "../ProductDetails/SiteFooter/SiteFooter";

import OrdersHeader from "./Components/OrdersHeader/OrdersHeader";
import OrderFilters from "./Components/OrderFilters/OrderFilters"
import OrderCard from "./Components/OrderCard/OrderCard";
import EmptyOrders from "./Components/EmptyOrders/EmptyOrders";

import { useOrders } from "../../Context/OrdersContext";

import "./OrdersPage.css";

function OrdersPage() {
  const { orders } = useOrders();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("latest");

  const filteredOrders = (
    activeFilter === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.status.toLowerCase() ===
            activeFilter.toLowerCase()
        )
  ).slice();

  if (sort === "oldest") {
    filteredOrders.reverse();
  }

  return (
    <div className="orders-page">

      <Navbar />

      <main className="orders-main">

        <OrdersHeader count={orders.length} />

        <OrderFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sort={sort}
          setSort={setSort}
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

