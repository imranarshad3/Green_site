import React from "react";
import "./PfIntro.css";

function PfIntro() {
  return (
    <section className="pf-intro" id="guide">
      <div className="pf-intro-inner">
        <div className="pf-intro-heading">
          <span className="pf-intro-kicker">START HERE</span>

          <h2>
            Everything your
            <br />
            plants need to <em>thrive.</em>
          </h2>
        </div>

        <div className="pf-intro-content">
          <p>
            Good plant care is less about doing more and more about noticing
            the right signals. Explore our simple guides for the everyday
            moments that make the biggest difference.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PfIntro;

