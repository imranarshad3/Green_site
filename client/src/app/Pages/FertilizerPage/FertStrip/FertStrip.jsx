import { Star } from 'lucide-react'
import React from 'react'
import "./FertStrip.css"

function FertStrip() {
  return (
    <div className="fert-strip">
        <p className="fert-strip-text">Healthy roots</p>
        <Star size={10} />

        <p className="fert-strip-text">Lush Leaves</p>
        <Star size={10} />

        <p className="fert-strip-text">New Growth</p>
        <Star size={10} />

        <p className="fert-strip-text">Happy plants</p>
        <Star size={10} />

    </div>
  )
}

export default FertStrip
