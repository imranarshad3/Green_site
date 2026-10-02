import React from "react";
import { Ban, Check, PackageCheck, Sprout, Truck } from "lucide-react";

import { formatOrderDate } from "../../../utils/orders";

import "./OdProgress.css";

const STEPS = [
  { key: "processing", label: "Order placed", note: "We're preparing your plants", Icon: Sprout },
  { key: "shipped", label: "Shipped", note: "On its way to you", Icon: Truck },
  { key: "delivered", label: "Delivered", note: "Settled into its new home", Icon: PackageCheck },
];

function OdProgress({ order }) {
  if (order.statusType === "cancelled") {
    return (
      <section className="od-progress od-progress-cancelled">
        <Ban size={20} />
        <div>
          <strong>
            Cancelled{order.cancelledAt && ` on ${formatOrderDate(order.cancelledAt)}`}
          </strong>
          <p>
            {order.cancelReason && `Reason: ${order.cancelReason}. `}
            Nothing will be shipped.
          </p>
        </div>
      </section>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === order.statusType);
  const stepDates = {
    processing: order.date,
    shipped: formatOrderDate(order.shippedAt),
    delivered: formatOrderDate(order.deliveredAt),
  };

  return (
    <section className="od-progress" aria-label="Order progress">
      <ol className="od-steps">
        {STEPS.map(({ key, label, note, Icon }, index) => {
          const state =
            index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";

          return (
            <li
              key={key}
              className={`od-step ${state}`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="od-step-icon">
                {state === "done" ? <Check size={16} /> : <Icon size={16} />}
              </span>
              <div>
                <strong>{label}</strong>
                <small>{(index <= currentIndex && stepDates[key]) || note}</small>
              </div>
            </li>
          );
        })}
      </ol>

      {(order.courier || order.trackingNumber) && order.statusType !== "processing" && (
        <p className="od-tracking">
          <Truck size={16} />
          <span>
            {order.courier ? `Shipped with ${order.courier}` : "Tracking number"}
            {order.trackingNumber && (
              <>
                {" · "}
                <strong>{order.trackingNumber}</strong>
              </>
            )}
          </span>
        </p>
      )}

      <div className="od-progress-bar">
        <span style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }} />
      </div>
    </section>
  );
}

export default OdProgress;
