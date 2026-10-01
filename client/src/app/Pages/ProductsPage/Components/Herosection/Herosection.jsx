import { Star } from 'lucide-react'
import React from 'react'
import "./Herosection.css"

function Herosection() {
  return (
    <section className="collection-hero">
      <div className="collection-circle collection-circle-one"></div>
      <div className="collection-circle collection-circle-one"></div>

      <div className="collection-content">
        <div className="collection-label">
          <span></span>
          <p>CURATED COLLECTION</p>
        </div>

        <h1>
          Plants worth building a
          <br />
          room around
        </h1>

        <p className="collection-description">
          Hand-picked  greenery, statement florals and premium ceramics -
          <br />
          sourced from growers we trust, delivered ready to thrive.
        </p>

        <div className="collection-stats">
          <div className="collection-stat">
            <h3>240+</h3>
            <p>Living plants</p>
          </div>

          <div className="collection-stat">
            <h3>4.9 <Star size={14}/></h3>
            <p>Avg. rating</p>
          </div>

          <div className="collection-stat">
            <h3>14 day</h3>
            <p>Grow guarantee</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Herosection
