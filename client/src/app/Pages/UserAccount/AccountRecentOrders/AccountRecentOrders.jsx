import {
  ArrowUpRightIcon,
  PackageCheckIcon,
  TruckIcon
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "./AccountRecentOrders.css";
import { useOrders } from "../../../Context/OrdersContext";

const RECENT_COUNT = 3;

function AccountRecentOrders() {
  const { orders } = useOrders();
  const recentOrders = orders.slice(0, RECENT_COUNT);

  return (
    <section className="account-orders-section">
      <div className="account-orders-container">

        <div className="account-orders-heading">
          <div>
            <p className="account-orders-kicker">
              YOUR PLANTIFY JOURNEY
            </p>

            <h2>
              Recent
              <span> orders.</span>
            </h2>

            <p className="account-orders-description">
              Keep track of your plants, deliveries and everything
              making its way to your home.
            </p>
          </div>

          <Link
            to="/orders"
            className="account-orders-view-all"
          >
            View all orders
            <ArrowUpRightIcon size={15} />
          </Link>
        </div>

        <div className="account-orders-list">
          {recentOrders.length === 0 && (
            <p className="account-orders-description">
              You haven't placed any orders yet.
            </p>
          )}

          {recentOrders.map((order) => (
            <article
              className="account-order-card"
              key={order.id}
            >
              <div className="account-order-main">

                <div className="account-order-images">
                  {order.items.map((product, index) => (
                    <div
                      className="account-order-image"
                      key={`${order.id}-${index}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      {product.quantity > 1 && (
                        <span>
                          ×{product.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="account-order-info">
                  <p className="account-order-id">
                    ORDER #{order.id}
                  </p>

                  <h3>
                    {order.items[0].name}
                    {order.items.length > 1 &&
                      ` + ${order.items.length - 1} more`}
                  </h3>

                  <p className="account-order-date">
                    Placed {order.date}
                  </p>
                </div>

              </div>

              <div className="account-order-status">
                <div
                  className={`account-order-status-badge ${order.statusType}`}
                >
                  {order.statusType === "delivered" ? (
                    <PackageCheckIcon size={14} />
                  ) : (
                    <TruckIcon size={14} />
                  )}

                  {order.status}
                </div>

                <strong>
                  ${order.total.toFixed(2)}
                </strong>
              </div>

              <Link
                to="/orders"
                className="account-order-arrow"
              >
                <ArrowUpRightIcon size={17} />
              </Link>
            </article>
          ))}
        </div>

        <div className="account-orders-bottom">
          <p>
            Every order helps bring a little more life home.
          </p>

          <Link to="/products">
            Explore plants
            <ArrowUpRightIcon size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default AccountRecentOrders;
