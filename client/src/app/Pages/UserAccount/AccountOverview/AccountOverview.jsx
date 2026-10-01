import {
  ArrowUpRightIcon,
  HeartIcon,
  LeafIcon,
  PackageIcon,
  UserRoundIcon
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useOrders } from "../../../Context/OrdersContext";
import { useWishlist } from "../../../Context/WishlistContext";
import "./AccountOverview.css";

const pad = (count) => String(count).padStart(2, "0");

function AccountOverview() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();

  const deliveredCount = orders.filter(
    (order) => order.statusType === "delivered"
  ).length;
  const openCount = orders.length - deliveredCount;

  return (
    <section className="account-overview-section">
      <div className="account-overview-container">

        <div className="account-overview-heading">
          <div>
            <p className="account-overview-kicker">
              YOUR PLANTIFY SPACE
            </p>

            <h2>
              Everything in
              <span> one place.</span>
            </h2>
          </div>

          <button
            type="button"
            className="account-edit-link"
            onClick={() => openUserProfile()}
          >
            Edit profile
            <ArrowUpRightIcon size={15} />
          </button>
        </div>

        <div className="account-overview-grid">

          <div className="account-profile-card">
            <div className="account-profile-top">
              <div className="account-profile-avatar">
                <UserRoundIcon size={22} />
              </div>

              <div className="account-profile-status">
                <span></span>
                Active member
              </div>
            </div>

            <div className="account-profile-info">
              <p className="account-card-label">
                PERSONAL DETAILS
              </p>

              <h3>
                {user?.fullName || "Plant Lover"}
              </h3>

              <p className="account-profile-email">
                {user?.primaryEmailAddress?.emailAddress}
              </p>

              <p className="account-profile-location">
                Plantify member
              </p>
            </div>

            <button
              type="button"
              className="account-profile-action"
              onClick={() => openUserProfile()}
            >
              Manage profile
              <ArrowUpRightIcon size={15} />
            </button>
          </div>

          <Link
            to="/orders"
            className="account-stat-card"
          >
            <div className="account-stat-icon">
              <PackageIcon size={19} />
            </div>

            <div className="account-stat-content">
              <p>ORDERS</p>
              <strong>{pad(orders.length)}</strong>
              <span>
                {deliveredCount} delivered · {openCount} on the way
              </span>
            </div>

            <ArrowUpRightIcon
              className="account-stat-arrow"
              size={17}
            />
          </Link>

          <Link
            to="/wishlist"
            className="account-stat-card"
          >
            <div className="account-stat-icon">
              <HeartIcon size={19} />
            </div>

            <div className="account-stat-content">
              <p>WISHLIST</p>
              <strong>{pad(wishlistCount)}</strong>
              <span>
                Plants saved for later
              </span>
            </div>

            <ArrowUpRightIcon
              className="account-stat-arrow"
              size={17}
            />
          </Link>

          <div className="account-points-card">
            <div className="account-points-icon">
              <LeafIcon size={20} />
            </div>

            <div className="account-points-content">
              <p>PLANT POINTS</p>

              <strong>248</strong>

              <span>
                52 points to your next reward
              </span>
            </div>

            <div className="account-points-progress">
              <span></span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AccountOverview;
