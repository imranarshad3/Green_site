import { ArrowRight } from "lucide-react";
import React from "react";
import "./Herosection.css";

import plantImage from "./Images/plant.png";
import cactusImage from "./Images/cactus.png";
import flowerImage from "./Images/flower.png";
import { Link } from "react-router-dom";

function Herosection() {
  return (
    <section className="hero-section">
      <div className="hero-container">

        <div className="hero-content">
          <h1 className="hero-heading">
            Happiness
            <br />
            blooms from
            <br />
            within
          </h1>

          <p className="hero-paragraph">
            Our environment, the world in which we live and
            work, is a mirror of our attitudes and expectations.
          </p>

          <div className="hero-buttons">
            <Link to = "/products" >
            <button className="shop-btn">
              Shop now
            </button>
            </Link>

            <Link to = "/products" className="explore-btn">
              <span>Explore plants</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="hero-gallery">

          <div className="gallery-left">

            <div className="gallery-small gallery-top">
              <img src={plantImage} alt="Green plant" />

              <span className="gallery-label">
                New
              </span>
            </div>

            <div className="gallery-small gallery-bottom">
              <img src={cactusImage} alt="Cactus" />

              <span className="gallery-label">
                Popular
              </span>
            </div>

          </div>

          <div className="gallery-feature">
            <img src={flowerImage} alt="Anthurium Flower" />

            <span className="gallery-label">
              Featured
            </span>

            <div className="feature-overlay">
              <h2>Anthurium Flower</h2>

              <p>
                The flower of human being. It has meaningful
                of fact that the plant always grow whatever
                season and weather.
              </p>

              <button className="read-more-btn">
                READ MORE
              </button>
            </div>
          </div>

            <div className="dots">
                {Array.from({ length: 25 }).map((_, index) => (
                    <span key={index}></span>
                ))}
                </div>

        </div>
      </div>
    </section>
  );
}

export default Herosection;
