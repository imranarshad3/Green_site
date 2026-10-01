import { ArrowRight, ArrowUpRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "./Herosection.css";

import plantImage from "./Images/plant.webp";
import cactusImage from "./Images/cactus.webp";
import flowerImage from "./Images/flower.webp";

function Herosection() {
  return (
    <section className="hm-hero">
      <div className="hm-container hm-hero-inner">
        <div className="hm-hero-content">
          <span className="hm-eyebrow hm-hero-eyebrow">
            Plantify Garden · Lahore
          </span>

          <h1 className="hm-hero-title">
            Happiness <em>blooms</em>
            <br />
            from within.
          </h1>

          <p className="hm-hero-lead">
            Hand-picked houseplants, thoughtful pots and simple care
            guidance, delivered ready to thrive in your home.
          </p>

          <div className="hm-hero-actions">
            <Link to="/products" className="hm-button hm-button--light">
              Shop plants
              <ArrowRight size={18} />
            </Link>

            <Link to="/guide" className="hm-hero-link">
              Read the care guide
            </Link>
          </div>
        </div>

        <div className="hm-hero-gallery">
          <figure className="hm-hero-tile hm-hero-tile--top">
            <img src={plantImage} alt="Leafy green plant in a white pot" />
            <figcaption>New</figcaption>
          </figure>

          <figure className="hm-hero-tile hm-hero-tile--bottom">
            <img src={cactusImage} alt="Flowering cactus in a mug" />
            <figcaption>Popular</figcaption>
          </figure>

          <figure className="hm-hero-tile hm-hero-feature">
            <img src={flowerImage} alt="Tulips in a vase" />
            <figcaption>Spotlight</figcaption>

            <div className="hm-hero-feature-card">
              <p className="hm-hero-feature-name">Flowering favourites</p>
              <p className="hm-hero-feature-text">
                Statement blooms, sourced from growers we trust.
              </p>
              <Link
                to="/search?q=Flowering"
                className="hm-hero-feature-link"
              >
                Shop flowering plants
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default Herosection;
