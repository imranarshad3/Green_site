import React from "react";
import { Sun, Droplets, Sprout } from "lucide-react";
import "./SignalRow.css";

function SignalRow() {
  return (
    <section className="signal-row-section">
      <div className="pf-signal-row">

        <div className="pf-signal-div">
          <div className="pf-signal-icon">
            <Sun />
          </div>

          <div className="pf-signal-div-block">
            <h2 className="pf-signal-title">LIGHT</h2>
            <p>Read the room</p>
          </div>
        </div>

        <div className="pf-signal-div">
          <div className="pf-signal-icon">
            <Droplets />
          </div>

          <div className="pf-signal-div-block">
            <h2 className="pf-signal-title">WATER</h2>
            <p>Follow the soil</p>
          </div>
        </div>

        <div className="pf-signal-div">
          <div className="pf-signal-icon">
            <Sprout />
          </div>

          <div className="pf-signal-div-block">
            <h2 className="pf-signal-title">GROWTH</h2>
            <p>Feed with intention</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default SignalRow;
