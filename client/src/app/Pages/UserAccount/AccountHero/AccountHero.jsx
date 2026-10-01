import { MoveUpRightIcon, StarsIcon } from "lucide-react";
import { Link } from "react-router-dom"
import React from "react";
import { useUser } from "@clerk/clerk-react";
import "./AccountHero.css";
import heroimage from "./images/hero1.webp"

function AccountHero() {
  const { user } = useUser();
  const firstName = user?.firstName || "Plant Lover";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : null;

  return (
    <section className="user-account-hero-section">
      <div className="user-account-hero-container">

        <div className="user-account-hero-block">
          <p className="pa-kicker">
            MY ACCOUNT <span>·</span> PLANTIFY
          </p>

          <h1 className="pa-hero">
            Your space to <span>grow.</span>
          </h1>

          <p className="pa-hero-description">
            Welcome back, {firstName}. Everything you love about Plantify,
            gathered into one calm and personal space.
          </p>

          <div className="pa-hero-actions">
            <Link to="/orders" className="pa-primary-button">
              View my orders
              <MoveUpRightIcon size={16} />
            </Link>

            <Link to="/products" className="pa-secondary-button">
              Continue shopping
              <MoveUpRightIcon size={15} />
            </Link>
          </div>
        </div>

        <div className="pa-hero-card-image">
          <div className="pa-hero-image-wrapper">
            <img
              src={heroimage}
              alt="Plantify member plant"
            />
          </div>

          <div className="pa-hero-card-content">
            <p className="pa-hero-card-content-kicker">
              PLANTIFY MEMBER
            </p>

            <h2 className="pa-hero-card-content-h2">
              Thoughtful plants.
              <br />
              Thoughtful spaces.
            </h2>

            {memberSince && (
              <p className="pa-card-meta">
                Member since {memberSince}
              </p>
            )}
          </div>

          <div className="pa-hero-card-badge">
            <StarsIcon size={19} />
          </div>
        </div>

      </div>
    </section>
  );
}

export default AccountHero;
