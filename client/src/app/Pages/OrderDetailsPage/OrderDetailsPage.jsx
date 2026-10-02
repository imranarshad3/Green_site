import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PackageSearch } from "lucide-react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import SiteFooter from "../ProductDetails/SiteFooter/SiteFooter";

import OdHeader from "./OdHeader/OdHeader";
import OdProgress from "./OdProgress/OdProgress";
import OdActions from "./OdActions/OdActions";
import OdReturn from "./OdReturn/OdReturn";
import OdItems from "./OdItems/OdItems";
import OdSummary from "./OdSummary/OdSummary";

import { useOrders } from "../../Context/OrdersContext";

import "./OrderDetailsPage.css";

function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const { orders, getOrder } = useOrders();
  const { state } = useLocation();
  const [result, setResult] = useState({ key: null, order: null, error: null });

  useEffect(() => {
    getOrder(orderNumber)
      .then((order) => setResult({ key: orderNumber, order, error: null }))
      .catch((error) => setResult({ key: orderNumber, order: null, error }));
  }, [orderNumber, getOrder]);

  const cached = orders.find((order) => order.id === orderNumber);
  const isFetched = result.key === orderNumber;
  const order = isFetched ? result.order ?? cached : cached;

  let content;

  const onUpdated = (updated) =>
    setResult({ key: orderNumber, order: updated, error: null });

  if (order) {
    content = (
      <>
        <OdHeader order={order} />
        {state?.placed && (
          <p className="od-placed" role="status">
            <CheckCircle2 size={20} />
            <span>
              Thank you! Your order has been placed. We'll pack it within 1–2 business days.
            </span>
          </p>
        )}
        <OdActions order={order} onUpdated={onUpdated} />
        <OdProgress order={order} />
        <OdReturn order={order} onUpdated={onUpdated} />

        <div className="od-layout">
          <OdItems items={order.items} />
          <OdSummary order={order} />
        </div>
      </>
    );
  } else if (!isFetched) {
    content = <p className="od-message" aria-busy="true">Loading your order…</p>;
  } else {
    content = (
      <div className="od-missing">
        <PackageSearch size={34} strokeWidth={1.2} />

        <h1>
          {result.error ? "We couldn't load this order." : "Order not found."}
        </h1>

        <p>
          {result.error
            ? "Something went wrong while fetching it. Please try again in a moment."
            : `There's no order #${orderNumber} on your account.`}
        </p>

        <Link to="/orders" className="od-missing-link">
          <ArrowLeft size={16} />
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="od-page">
      <Navbar />

      <main className="od-main">{content}</main>

      <SiteFooter />
    </div>
  );
}

export default OrderDetailsPage;
