import React from 'react'
import "./FertQuote.css";
import { Link } from 'react-router-dom';


function FertQuote() {
  return (
        <div className="fert-qoute-section">
            <div className="fert-qoute">
                <p className="fer-kicker-light">
                    Plantify care notes
                </p>

                <h2 className="fert-qoute-title">
                    Small rituals. <br />
                    Beautiful growth.
                </h2>

                <Link to = "/guide" className="fert-button-light">
                    Explore plant guide
                </Link>
            </div>
        </div>
  )
}

export default FertQuote;
