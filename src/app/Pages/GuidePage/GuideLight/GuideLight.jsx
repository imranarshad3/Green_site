import React from "react";
import "./GuideLight.css";
import lightimage from "./Lightimage.png"

function GuideLight() {
  return (
    <section className="pf-plant-place-section">
      <div className="pf-plant-place-container">

        <div className="pf-plant-place-image">
          <img
            src={lightimage}
            alt="Indoor tropical plant"
          />
        </div>

        <div className="pf-plant-place-content">
          <p className="pf-plant-place-label">
            Find their place
          </p>

          <h2 className="pf-plant-place-title">
            Every plant
            <br />
            has a <em>place.</em>
          </h2>

          <p className="pf-plant-place-description">
            Start with the light your room naturally gives you. Then choose a
            plant that loves it.
          </p>

          <div className="pf-plant-place-guide">

            <div className="pf-plant-place-row">
              <span className="pf-plant-place-level">
                Low
              </span>

              <span className="pf-plant-place-detail">
                Quiet corners &amp; softer rooms
              </span>
            </div>

            <div className="pf-plant-place-row">
              <span className="pf-plant-place-level">
                Medium
              </span>

              <span className="pf-plant-place-detail">
                Bright spaces without harsh sun
              </span>
            </div>

            <div className="pf-plant-place-row">
              <span className="pf-plant-place-level">
                Bright
              </span>

              <span className="pf-plant-place-detail">
                Filtered light &amp; sunny windows
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default GuideLight;
