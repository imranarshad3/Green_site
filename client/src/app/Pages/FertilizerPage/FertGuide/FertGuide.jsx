import React from "react";
import image from "../FertilizerImages/shopimage.png";
import "./FertGuide.css";

function FertGuide() {
  return (
    <div className="fert-guide-section" id="how-it-works">
      <div className="fert-guide-image">
        <img src={image} alt="Image" />
      </div>

      <div className="fert-guide-copy">
        <p>A simple Ritual</p>
        <h2 className="fert-guide-h2">
          Feed less. <br />
          Grow better.
        </h2>

        <p className="fert-guide-text">
          Plant care should feel calm, not complicated. Pick the formula that
          fits your plant, dilute as directed, and make feeding part of your
          regular care rhythm.
        </p>

        <div className="fert-guide-steps">
          <div className="fert-guide-step">
            <span>01</span>
            <div className="fert-guide-block">
              <h3 className="fert-step-title">Choose</h3>
              <p className="fert-step-desc">
                Match the formula to your plant's needs.
              </p>
            </div>
          </div>

          <div className="fert-guide-step">
            <span>02</span>
            <div className="fert-guide-block">
              <h3 className="fert-step-title">Mix</h3>
              <p className="fert-step-desc">
                Dilute with water according to the label.
              </p>
            </div>
          </div>

          <div className="fert-guide-step">
            <span>03</span>
            <div className="fert-guide-block">
              <h3 className="fert-step-title">Feed</h3>
              <p className="fert-step-desc">
                Apply during active growth and watch it thrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FertGuide;
