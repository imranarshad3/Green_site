import React from "react";
import Navbar from "../../ReusedComponents/Navbar/Navbar";
import Herosection from "./Components/Herosection/Herosection";
import ValueStrip from "./Components/ValueStrip/ValueStrip";
import Featured from "./Components/Featured/Featured";
import SearchFilter from "./Components/SearchFilter/SearchFilter";
import NewArrivals from "./Components/NewArrivals/NewArrivals";
import Plantstand from "./Components/Plantstands/Plantstand";
import Services from "./Components/Services/Services";
import Location from "./Components/Location/Location";
import HomeFooter from "./Components/HomeFooter/HomeFooter";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home">
      <Navbar />
      <Herosection />
      <ValueStrip />
      <Featured />
      <SearchFilter />
      <NewArrivals />
      <Plantstand />
      <Services />
      <Location />
      <HomeFooter />
    </div>
  );
}

export default HomePage;
