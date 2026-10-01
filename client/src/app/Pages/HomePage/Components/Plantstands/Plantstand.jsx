import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import stand1 from "./plantstands/stand1.png";
import stand2 from "./plantstands/stand2.png";
import stand3 from "./plantstands/stand3.png";
import "./Plantstand.css";

const STANDS = [
  { id: 1, image: stand1, title: "Macramé Plant Hanger" },
  { id: 2, image: stand2, title: "Terracotta Pot Hanger" },
  { id: 3, image: stand3, title: "S-Hanger Hooks" },
];

function Plantstand() {
  return (
    <section className="hm-section hm-stands">
      <div className="hm-container hm-stands-inner">
        <div className="hm-stands-intro">
          <span className="hm-eyebrow">Plant stands</span>
          <h2 className="hm-title">
            Hang them <em>beautifully.</em>
          </h2>
          <p className="hm-lead">
            Handcrafted hangers and hooks that lift your greenery off the
            shelf and into the light.
          </p>
          <Link to="/products" className="hm-text-link">
            Explore the shop
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hm-stands-grid">
          {STANDS.map((item) => (
            <figure className="hm-stand" key={item.id}>
              <div className="hm-stand-image">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Plantstand;
