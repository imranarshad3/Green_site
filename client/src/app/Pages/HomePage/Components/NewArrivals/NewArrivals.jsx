import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { newArrivals } from "../../../../../../Data/data";
import "./NewArrivals.css";

function NewArrivals() {
  return (
    <section className="hm-section hm-arrivals">
      <div className="hm-container">
        <div className="hm-section-head">
          <div>
            <span className="hm-eyebrow">Just arrived</span>
            <h2 className="hm-title">
              Colorful <em>new arrivals</em>
            </h2>
          </div>

          <Link to="/search?q=Flowering" className="hm-text-link">
            Shop flowering plants
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hm-arrivals-grid">
          {newArrivals.map((item, index) => (
            <Link
              to="/search?q=Flowering"
              className={`hm-arrival ${index % 2 === 1 ? "is-offset" : ""}`}
              key={item.name}
            >
              <img src={item.image} alt={item.name} loading="lazy" />
              <span className="hm-arrival-caption">
                <span>{item.name}</span>
                <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
