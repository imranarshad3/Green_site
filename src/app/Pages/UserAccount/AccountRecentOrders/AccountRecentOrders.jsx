import {
  ArrowUpRightIcon,
  PackageCheckIcon,
  TruckIcon
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "./AccountRecentOrders.css";

const orders = [
  {
    id: "#PLF-1024",
    date: "28 Sep 2026",
    status: "Delivered",
    statusType: "delivered",
    products: [
      {
        name: "Monstera Deliciosa",
        image: "/images/monstera.jpg",
        quantity: 1
      },
      {
        name: "Leaf & Bloom",
        image: "/images/leaf-bloom.jpg",
        quantity: 2
      }
    ],
    total: "$84.00"
  },
  {
    id: "#PLF-1018",
    date: "21 Sep 2026",
    status: "On the way",
    statusType: "shipping",
    products: [
      {
        name: "Snake Plant",
        image: "/images/snake-plant.jpg",
        quantity: 1
      },
      {
        name: "Balanced Growth",
        image: "/images/balanced-growth.jpg",
        quantity: 1
      }
    ],
    total: "$62.00"
  },
  {
    id: "#PLF-1007",
    date: "12 Sep 2026",
    status: "Delivered",
    statusType: "delivered",
    products: [
      {
        name: "Fiddle Leaf Fig",
        image: "/images/fiddle-leaf.jpg",
        quantity: 1
      }
    ],
    total: "$48.00"
  }
];

function AccountRecentOrders() {
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
          {orders.map((order) => (
            <article
              className="account-order-card"
              key={order.id}
            >
              <div className="account-order-main">

                <div className="account-order-images">
                  {order.products.map((product, index) => (
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
                    ORDER {order.id}
                  </p>

                  <h3>
                    {order.products[0].name}
                    {order.products.length > 1 &&
                      ` + ${order.products.length - 1} more`}
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
                  {order.total}
                </strong>
              </div>

              <Link
                to={`/orders/${order.id}`}
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
