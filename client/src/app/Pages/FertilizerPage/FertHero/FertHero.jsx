import React from "react";
import heroimage from "../FertilizerImages/Heroimage.webp"
import "./FertHero.css";

function FertHero() {
  return (
    <div className="fert-hero-section">
      <div className="fert-hero">
        <div className="div-block">
          <p>Plant care / Fertilizer</p>
          <h1 className="fert-h1">
            Feed your plants.
            <br />
            Let them flourish.
          </h1>

          <p className="fert-lead">
            Premium plant nutrition for stronger roots, richer foliage, and
            beautiful new growth. Simple formulas made for everyday plant
            people.
          </p>

          <div className="fert-actions">
            <a href="#shop" className="fert-button">Shop fertilizers</a>
            <a href="#how-it-works">How it works</a>
          </div>

          <div className="fert-trust">
            <span>01</span>

            <div className="fert-trust-block">
              <p className="fert-title">Thoughtfully selected formulas</p>
              <p className="fert-trust-des">
                Made for foliage, roots, flowers and everyday growth.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroimage} alt="Heroimage" />
          <div className="fert-product-float">
            <p className="fert-float-label">Plantify &middot; Grow</p>

            <p className="fert-float-title">Growth Essentials</p>

            <p className="fert-float-meta">NPK + Micro Nutrients</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FertHero;
