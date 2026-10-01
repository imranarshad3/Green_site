import { StarsIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom';
import "./WishListRitual.css"

function WishListRitual() {
  return (
    <div className="wish-list-ritual">
        <div className="wl-ritual-icon">
            <StarsIcon size={17} />
        </div>
        <div className="wl-ritual-div">
            <p className='wl-ritual-kicker'>A little plantify Ritual</p>
            <h2>Love it now. Grow into it later.</h2>
            <p className="wl-ritual-copy">Your wishlist keeps the plants that caught your eye in one calm place, ready whenever you're ready.</p>
        </div>
        <div className="wl-ritual-button">
            <Link to="/products" >
                Explore all plants
            </Link>
        </div>
    </div>
  )
}

export default WishListRitual
