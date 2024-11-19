
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./Components/Products/Products";
import Billing from './Components/Billing/Billing'
import AddBilling from "./Components/AddBilling/AddBilling";
import BarcodePage from "./Components/BarcodePage/BarcodePage";
import Home from "./Components/Home/Home";
import Navbarr from "./Components/Navbarr/Navbarr";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [lotNumber, setLotNumber] = useState(""); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="navbarr" element={<Navbarr />} />
        <Route
          path="/products/:lot_id"
          element={
            <Products
              setSelectedProduct={setSelectedProduct}
              setLotNumber={setLotNumber}
            />
          }
        />
        <Route path="/billing" element={<Billing />} />
        <Route
          path="/billing/:bill_number/add"
          element={
            <AddBilling
              selectedProduct={selectedProduct}
              lotNumber={lotNumber}
            />
          }
        />
        <Route path="/" element={<Home />} />
      
        <Route path="/products/:id" element={<Products />} />
        <Route path="/barcode/:sNo" element={<BarcodePage />} />
        <Route
          path="/billing/:bill_number/add/:bill_type"
          element={<AddBilling />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
