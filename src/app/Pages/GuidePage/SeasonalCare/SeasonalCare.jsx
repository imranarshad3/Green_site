import React from "react";
import { Link } from "react-router-dom";
import "./SeasonalCare.css";
import image from "./image/image.png";

function SeasonalCare() {
  return (
    <section className="seasonal-care-section">
      <div className="seasonal-care-inner">
        <div className="seasonal-care-content">
          <span className="seasonal-care-kicker">
            SEASONAL CARE
          </span>

          <h2 className="seasonal-care-title">
            Your plants
            <br />
            change
            <br />
            with the <em>season.</em>
          </h2>

          <p className="seasonal-care-text">
            Adjust watering, feeding and placement as the year moves.
          </p>

          <Link to="/guide/seasonal" className="seasonal-care-button">
            See seasonal tips <span>→</span>
          </Link>
        </div>

        <div className="seasonal-care-image-wrapper">
          <img
            src={image}
            alt="Green houseplant changing with the season"
            className="seasonal-care-image"
          />
        </div>
      </div>
    </section>
  );
}

export default SeasonalCare;
