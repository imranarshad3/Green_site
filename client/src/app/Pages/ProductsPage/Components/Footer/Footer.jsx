import { Clock, Heart, ShieldCheck, Truck } from 'lucide-react'
import React from 'react'
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer-section">
        <div className="nav">
            <div className="container">
                <div className="logo">
                    <Truck />
                </div>
                <div className="content">
                    <h3>Free regional shipping</h3>
                    <p>On all orders over $50</p>
                </div>
            </div>

            
            <div className="container">
                <div className="logo">
                    <ShieldCheck />
                </div>
                <div className="content">
                    <h3>14-day guarantee</h3>
                    <p>Healthy on arrival, or replaced</p>
                </div>
            </div>

            <div className="container">
                <div className="logo">
                    <Clock />
                </div>
                <div className="content">
                    <h3>Ships in 24–48h</h3>
                    <p>Hand-packed by our growers</p>
                </div>
            </div>

            <div className="container">
                <div className="logo">
                    <Heart />
                </div>
                <div className="content">
                    <h3>Loved by 12k+ plant parents</h3>
                    <p>4.9 average rating</p>
                </div>
            </div>


        </div>

        <div className="foot">
            © 2026 Plantify Garden. All rights reserved.
        </div>
    </footer>
  )
}

export default Footer
