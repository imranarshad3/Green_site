import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./app/Pages/HomePage/Homepage";
import Productspage from "./app/Pages/ProductsPage/Productspage";
import ProductDetails from "./app/Pages/ProductDetails/ProductDetails";
import FertilizerPage from "./app/Pages/FertilizerPage/FertilizerPage";
import Guidepage from "./app/Pages/GuidePage/Guidepage";


function App() {
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Productspage/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/fertilizers" element = {<FertilizerPage />} />
        <Route path="/guide" element = {<Guidepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
