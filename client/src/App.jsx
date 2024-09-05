import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Review from "./pages/Review";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="content-container p-4">
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Order" element={<Order />} />
            <Route path="/Review" element={<Review />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
