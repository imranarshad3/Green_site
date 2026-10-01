import React from "react";
import "./GuideHero.css"
import heroimage from "./heroimage.webp"

function GuideHero() {
  return (
    <section className="guidehero-section">
        <div className="pf-guidehero-div">

      <div className="pf-guide-block">
        <span className="pf-kicker">PLANTIFY GUIDE</span>

        <h1 className="product-guide-hero-title">
          Grow with
          <br />
          <em>confidence.</em>
        </h1>

        <p className="pf-hero-text">
          Simple, thoughtful guidance for choosing, caring for, and living
          beautifully with plants.
        </p>

        <div className="pf-hero-actions">
          <a href="#guide" className="pf-btn-dark">
            Explore the Guide <span>↗</span>
          </a>

          <a href="#routine" className="pf-link">
            Build my routine <span>→</span>
          </a>
        </div>
      </div>

      <div className="pf-hero-media">
        <div className="pf-hero-visual">
          <img
            className="pf-hero-img"
            src={heroimage}
            alt="Lush green houseplants in a bright interior"
          />

          <div className="pf-float">
            <span className="pf-float-number">01</span>

            <h2>Care, made simple.</h2>

            <span className="pf-float-meta">
              Light · Water · Growth
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export default GuideHero;
