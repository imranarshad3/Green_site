import React from "react";
import "./RoutineHead.css";

function RoutineHead() {
  return (
    <section className="pf-routine-head-section" id="routine">
      <div className="pf-routine-head-info">

        <div className="pf-routine-head-div">
          <div className="pf-routine-h2-block">
            <p>The 5-minute routine</p>

            <h2>
              Small rituals.
              <br />
              Beautiful growth.
            </h2>
          </div>

          <p>
            You don't need a complicated routine. A few quiet moments of
            attention can keep your plants healthier all year.
          </p>
        </div>

        <div className="pf-routine-steps">

          <div className="pf-routine-step">
            <span>01</span>

            <h2>Check the soil</h2>

            <p>
              Feel the top few centimetres before you water.
            </p>
          </div>

          <div className="pf-routine-step">
            <span>02</span>

            <h2>Read the leaves</h2>

            <p>
              Drooping, yellowing, crispy edges and new growth all tell a story.
            </p>
          </div>

          <div className="pf-routine-step">
            <span>03</span>

            <h2>Rotate the pot</h2>

            <p>
              Give every side a little access to light for balanced growth.
            </p>
          </div>

          <div className="pf-routine-step">
            <span>04</span>

            <h2>Clean &amp; feed</h2>

            <p>
              Wipe broad leaves and fertilize during active growth.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default RoutineHead;