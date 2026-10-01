import React from 'react'
import Navbar from "../../ReusedComponents/Navbar/Navbar";
import FertHero from './FertHero/FertHero';
import FertStrip from './FertStrip/FertStrip';
import FertShop from './FertShop/FertShop';
import FertGuide from './FertGuide/FertGuide';
import FertQuote from './FertQuote/FertQuote';
import SiteFooter from '../ProductDetails/SiteFooter/SiteFooter';

import "./FertilizerPage.css"

function FertilizerPage() {
  return (
        <div className="fertilizer-page">
            <Navbar />
            <FertHero />
            <FertStrip />
            <FertShop />
            <FertGuide />
            <FertQuote />
            <SiteFooter />
        </div>
  )
}

export default FertilizerPage
