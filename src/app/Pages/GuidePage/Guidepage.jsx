import React from 'react'
import Navbar from "../../ReusedComponents/Navbar/Navbar"
import GuideHero from './GuideHero/GuideHero'
import PfIntro from './PfIntro/PfIntro'
import SignalRow from './Signalrow/SignalRow'
import SeasonalCare from './SeasonalCare/SeasonalCare'
import RoutineHead from './RoutineHead/RoutineHead'
import GuideLight from './GuideLight/GuideLight'
import SiteFooter from ".././ProductDetails/SiteFooter/SiteFooter"
import GuideCta from './GuideCta/GuideCta'

function Guidepage() {
  return (
        <div className="guide-page">
            <Navbar />
            <GuideHero />
            <PfIntro />
            <SignalRow />
            <SeasonalCare />
            <GuideLight />
            <RoutineHead />
            <GuideCta />
            <SiteFooter />

            
        </div>
  )
}

export default Guidepage;
