import {
  ArrowUpRightIcon,
  HeartIcon,
  LeafIcon,
  PackageIcon,
  UserRoundIcon
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "./AccountOverview.css";

function AccountOverview() {
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

          <Link
            to="/account/profile"
            className="account-edit-link"
          >
            Edit profile
            <ArrowUpRightIcon size={15} />
          </Link>
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
                Imran Khan
              </h3>

              <p className="account-profile-email">
                imran@example.com
              </p>

              <p className="account-profile-location">
                Plantify member · Lahore, Pakistan
              </p>
            </div>

            <Link
              to="/account/profile"
              className="account-profile-action"
            >
              Manage profile
              <ArrowUpRightIcon size={15} />
            </Link>
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
              <strong>03</strong>
              <span>
                2 delivered · 1 on the way
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
              <strong>06</strong>
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
