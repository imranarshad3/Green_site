import React from "react";
import { Link } from "react-router-dom";
import "./GuideCta.css";

function GuideCta() {
  return (
    <section className="pf-guide-cta-section">
      <div className="guide-cta">
        <p className="guide-cta-ticker">
          PLANTIFY · GARDEN NOTES
        </p>

        <h2>
          Healthy plants.
          <br />
          Beautiful spaces.
        </h2>

        <p className="guide-cta-desc">
          Ready to bring a little more green home?
        </p>

        <Link to="/products" className="guide-cta-button">
          Find Your Plants
        </Link>
      </div>
    </section>
  );
}

export default GuideCta;
